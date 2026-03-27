import { cache } from "react";
import dbConnect from "./db";
import News from "@/models/News";
import Category from "@/models/Category";
import Video from "@/models/Video";
import EPaper from "@/models/EPaper";
import Logo from "@/models/Logo";
import Navbar from "@/models/Navbar";
import Settings from "@/models/Settings";
import Member from "@/models/Member";
import { divisions, districts } from "./locations";
import { optimizeCloudinaryUrl, generateBlurDataURL } from "@/utils/cloudinary";

const NEWS_LIST_PROJECTION = {
  comments: 0,
  metaTitle: 0,
  metaDescription: 0,
};

export const getEPaperEditions = cache(async (page = 1, limit = 12) => {
  await dbConnect();
  const skip = (page - 1) * limit;

  const editions = await EPaper.find({ status: "published" })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await EPaper.countDocuments({ status: "published" });

  return {
    data: JSON.parse(JSON.stringify(editions)),
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
});

export const getSingleEPaperEdition = cache(async (dateStr) => {
  await dbConnect();

  // Parse the date string carefully. Use T00:00:00Z to force UTC interpretation of YYYY-MM-DD
  const targetDate = new Date(`${dateStr}T00:00:00Z`);

  if (isNaN(targetDate.getTime())) {
    return { error: "Invalid date format" };
  }

  // Try multiple ways to find the date
  const startOfDay = new Date(targetDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let edition = await EPaper.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: "published",
  }).lean();

  if (!edition) {
    const wideStart = new Date(targetDate);
    wideStart.setUTCDate(wideStart.getUTCDate() - 1);
    const wideEnd = new Date(targetDate);
    wideEnd.setUTCDate(wideEnd.getUTCDate() + 1);

    const potentialEditions = await EPaper.find({
      date: { $gte: wideStart, $lte: wideEnd },
      status: "published",
    }).lean();

    edition = potentialEditions.find((e) => {
      const d = new Date(e.date);
      return d.toISOString().split("T")[0] === dateStr;
    });
  }

  if (!edition) {
    const allEditions = await EPaper.find({ status: "published" }, { date: 1 })
      .sort({ date: -1 })
      .limit(10)
      .lean();
    return {
      error: "Edition not found",
      availableDates: allEditions.map(
        (e) => e.date.toISOString().split("T")[0],
      ),
    };
  }

  return { success: true, data: JSON.parse(JSON.stringify(edition)) };
});

export const getNavbarItems = cache(async () => {
  await dbConnect();
  let items = await Navbar.find().sort({ order: 1 }).lean();

  if (items.length === 0) {
    // Fallback to categories if no custom navbar items exist
    const categories = await Category.find().limit(10).lean();
    return categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      href: `/category/${c.slug}`,
      order: 0,
    }));
  }

  return items.map((item) => ({
    id: item._id.toString(),
    name: item.label,
    slug: item.href.startsWith("/category/")
      ? item.href.replace("/category/", "")
      : null,
    href: item.href,
    order: item.order,
  }));
});

export async function getDivisions() {
  return divisions;
}

export async function getDistricts(divisionId) {
  if (!divisionId) return [];
  return districts[divisionId] || [];
}

export async function getNewsByLocation(
  divisionId,
  districtId,
  page = 1,
  perPage = 10,
) {
  await dbConnect();
  const query = { status: "published" };
  // This is a placeholder logic, as we might need a Location model or location fields in News
  // For now, let's just return some news
  const skip = (page - 1) * perPage;
  const news = await News.find(query, NEWS_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .lean();
  const totalCount = await News.countDocuments(query);

  return {
    success: true,
    data: news.map(normalizeNews),
    meta: {
      current_page: page,
      last_page: Math.ceil(totalCount / perPage),
      total: totalCount,
    },
  };
}

export async function getNewsByCat(slug, limit = 20) {
  await dbConnect();
  let query = { status: "published" };
  if (slug !== "all") {
    const decodedSlug = decodeURIComponent(slug);
    const category =
      (await Category.findOne({ slug: decodedSlug }).lean()) ||
      (await Category.findOne({ slug: slug }).lean());

    // Fallback to decodedSlug if category object not found
    query.category = category ? category.name : decodedSlug;
  }
  const news = await News.find(query, NEWS_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return news.map(normalizeNews);
}

export const getTrendingNews = cache(async (limit = 10) => {
  await dbConnect();
  const news = await News.find(
    { isFeatured: true, status: "published" },
    NEWS_LIST_PROJECTION,
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return news.map(normalizeNews);
});

export async function getTrandingNews() {
  return getTrendingNews();
}

export const getBreakingNews = cache(async (limit = 10) => {
  await dbConnect();
  // Assuming we use 'isFeatured' or a specific category for breaking news
  // For now, just return most recent news
  const news = await News.find({ status: "published" }, NEWS_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return news.map(normalizeNews);
});

export const getFeaturedCategories = cache(async () => {
  await dbConnect();
  const categories = await Category.find().limit(10).lean();
  return categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
});

export const getSettings = cache(async () => {
  await dbConnect();
  const settingsList = await Settings.find({}).lean();
  const logo = await Logo.findOne().sort({ createdAt: -1 }).lean();

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return {
    site_logo: logo?.logoUrl || null,
    about_text: settings.about_text || "",
    address: settings.address || "",
    phone: settings.phone || "",
    email: settings.email || "",
    facebook_url: settings.facebook_url || "",
    twitter_url: settings.twitter_url || "",
    youtube_url: settings.youtube_url || "",
    instagram_url: settings.instagram_url || "",
    google_news_channle_link: settings.google_news_channle_link || "#",
    whats_app_channle_link: settings.whats_app_channle_link || "#",
  };
});

export async function searchNews(query) {
  await dbConnect();
  const news = await News.find(
    {
      status: "published",
      $or: [
        { headline: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    },
    NEWS_LIST_PROJECTION,
  )
    .sort({ createdAt: -1 })
    .lean();
  return news.map(normalizeNews);
}

export async function getVideoNews(page = 1, perPage = 12) {
  await dbConnect();
  const skip = (page - 1) * perPage;
  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .lean();
  const totalCount = await Video.countDocuments();

  const normalizedVideos = videos.map((v) => ({
    ...v,
    id: v._id.toString(),
    _id: v._id.toString(),
    name: v.title,
    slug: v._id.toString(), // or some slug if it had one
    created_at: v.createdAt?.toISOString() || v.createdAt,
    // Add extra_fields if components expect them, or modify components to use v.youtubeUrl
    extra_fields: [{ meta_name: "video_url", meta_value: v.youtubeUrl }],
  }));

  return {
    data: normalizedVideos,
    meta: {
      current_page: page,
      last_page: Math.ceil(totalCount / perPage),
      total: totalCount,
    },
  };
}

export async function getSingleNews(idOrSlug) {
  if (!idOrSlug || idOrSlug === "undefined") return null;
  await dbConnect();

  // Check if it's a valid MongoDB ObjectId
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  if (isObjectId) {
    const news = await News.findOne({
      _id: idOrSlug,
      status: "published",
    }).lean();
    return news ? normalizeNews(news) : null;
  }

  // If not an ObjectId, we don't have a slug field yet, so return null
  // or you could search by title if that was intended as a fallback
  return null;
}

export async function getNews(limit = 20) {
  await dbConnect();
  const news = await News.find({ status: "published" }, NEWS_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return news.map(normalizeNews);
}

export async function getCategoryNews(slug, page = 1, perPage = 10) {
  await dbConnect();

  const decodedSlug = decodeURIComponent(slug);

  // Find the category by slug first to get its name
  const category =
    (await Category.findOne({ slug: decodedSlug }).lean()) ||
    (await Category.findOne({ slug: slug }).lean());

  const skip = (page - 1) * perPage;

  // If category found in DB, query by its name.
  // If not found, fallback to using the slug directly (as it might be the name)
  const query = category
    ? { category: category.name, status: "published" }
    : { category: decodedSlug, status: "published" };

  const news = await News.find(query, NEWS_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .lean();
  const totalCount = await News.countDocuments(query);

  return {
    success: true,
    data: news.map(normalizeNews),
    meta: {
      current_page: page,
      last_page: Math.ceil(totalCount / perPage),
      total: totalCount,
    },
  };
}

export async function getSingleCategories(slug) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  return category
    ? { id: category._id.toString(), name: category.name, slug: category.slug }
    : null;
}

export async function getTrendingTags() {
  await dbConnect();
  const categories = await Category.find().limit(10).lean();
  return categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
}

function normalizeNews(item) {
  if (!item) return null;
  // Convert MongoDB internal fields to plain strings for Next.js serialization
  const news = {
    ...item,
    id: item._id.toString(),
    _id: item._id.toString(),
    name: item.headline || item.title,
    slug: item._id.toString(),
    featured_image: optimizeCloudinaryUrl(item.imageSrc),
    image: optimizeCloudinaryUrl(item.imageSrc), // For backward compatibility
    image_caption: item.imageCaption,
    description: item.content || item.reporterInfo,
    categories: [{ id: "1", name: item.category }],
    created_at: item.createdAt?.toISOString() || item.createdAt,
    updated_at: item.updatedAt?.toISOString() || item.updatedAt,
    blurDataURL: generateBlurDataURL(), // Add blur placeholder
  };
  return news;
}

export async function getMenus() {
  const categories = await getFeaturedCategories();
  return categories.map((cat) => ({
    id: cat.id,
    title: cat.name,
    slug: cat.slug,
    url: `/category/${cat.slug}`,
  }));
}

export async function getLeadNews() {
  return getBreakingNews(10);
}

export async function getMaxViewedNewsByCat(slug, perPage = 8) {
  return getNewsByCat(slug, perPage);
}

export async function getSingleVideoNews(idOrSlug) {
  if (!idOrSlug || idOrSlug === "undefined") return null;
  await dbConnect();

  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  if (isObjectId) {
    const v = await Video.findById(idOrSlug).lean();
    if (!v) return null;
    return {
      ...v,
      id: v._id.toString(),
      _id: v._id.toString(),
      name: v.title,
      slug: v._id.toString(),
      created_at: v.createdAt,
      extra_fields: [{ meta_name: "video_url", meta_value: v.youtubeUrl }],
    };
  }
  return null;
}

export async function getTeamMembers() {
  await dbConnect();
  const members = await Member.find().sort({ order: 1, createdAt: -1 }).lean();
  return members.map((m) => ({
    ...m,
    id: m._id.toString(),
  }));
}
