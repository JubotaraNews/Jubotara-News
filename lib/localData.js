import dbConnect from "./db";
import News from "@/models/News";
import Category from "@/models/Category";
import Video from "@/models/Video";
import Logo from "@/models/Logo";
import Navbar from "@/models/Navbar";
import Settings from "@/models/Settings";
import { divisions, districts } from "./locations";

export async function getNavbarItems() {
    await dbConnect();
    let items = await Navbar.find().sort({ order: 1 });
    
    if (items.length === 0) {
        // Fallback to categories if no custom navbar items exist
        const categories = await Category.find().limit(10).lean();
        return categories.map(c => ({
            id: c._id.toString(),
            name: c.name,
            slug: c.slug,
            href: `/category/${c.slug}`,
            order: 0
        }));
    }

    return items.map(item => ({
        id: item._id.toString(),
        name: item.label,
        slug: item.href.startsWith('/category/') ? item.href.replace('/category/', '') : null,
        href: item.href,
        order: item.order
    }));
}

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
  const query = {};
  // This is a placeholder logic, as we might need a Location model or location fields in News
  // For now, let's just return some news
  const skip = (page - 1) * perPage;
  const news = await News.find(query)
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
  const query = slug === "all" ? {} : { category: slug };
  const news = await News.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  return news.map(normalizeNews);
}

export async function getTrendingNews(limit = 10) {
  await dbConnect();
  const news = await News.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return news.map(normalizeNews);
}

export async function getTrandingNews() {
  return getTrendingNews();
}

export async function getBreakingNews(limit = 10) {
  await dbConnect();
  // Assuming we use 'isFeatured' or a specific category for breaking news
  // For now, just return most recent news
  const news = await News.find().sort({ createdAt: -1 }).limit(limit).lean();
  return news.map(normalizeNews);
}

export async function getFeaturedCategories() {
  await dbConnect();
  const categories = await Category.find().limit(10).lean();
  return categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
}

export async function getSettings() {
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
}

export async function searchNews(query) {
  await dbConnect();
  const news = await News.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  }).sort({ createdAt: -1 }).lean();
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
  return { data: videos.map((v) => ({ ...v, _id: v._id.toString() })) };
}

export async function getSingleNews(idOrSlug) {
  if (!idOrSlug || idOrSlug === "undefined") return null;
  await dbConnect();

  // Check if it's a valid MongoDB ObjectId
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  if (isObjectId) {
    const news = await News.findById(idOrSlug).lean();
    return news ? normalizeNews(news) : null;
  }

  // If not an ObjectId, we don't have a slug field yet, so return null
  // or you could search by title if that was intended as a fallback
  return null;
}

export async function getNews(limit = 20) {
  await dbConnect();
  const news = await News.find().sort({ createdAt: -1 }).limit(limit).lean();
  return news.map(normalizeNews);
}

export async function getCategoryNews(slug, page = 1, perPage = 10) {
  await dbConnect();
  const skip = (page - 1) * perPage;
  const query = { category: slug };
  const news = await News.find(query)
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
  const news = item.toObject ? item.toObject() : item;
  const id = news._id.toString();
  return {
    ...news,
    id: id,
    name: news.title,
    slug: id,
    featured_image: news.imageSrc,
    description: news.content || news.summary,
    categories: [{ id: "1", name: news.category }],
  };
}

export async function getMenus() {
  const categories = await getFeaturedCategories();
  return categories.map(cat => ({
      id: cat.id,
      title: cat.name,
      slug: cat.slug,
      url: `/category/${cat.slug}`
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
    const video = await Video.findById(idOrSlug).lean();
    return video ? { ...video, _id: video._id.toString() } : null;
  }
  return null;
}

export async function getTeamMembers() {
  return [
      { id: 1, name: "নিজস্ব প্রতিবেদক", role: "প্রতিবেদক", image: "/images/logo.png" }
  ];
}
