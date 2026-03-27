// utils/formatDate.js

export function formatBengaliDate(isoString) {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "অজানা তারিখ";

    const months = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
    ];

    const bengaliNumbers = {
        0: "০",
        1: "১",
        2: "২",
        3: "৩",
        4: "৪",
        5: "৫",
        6: "৬",
        7: "৭",
        8: "৮",
        9: "৯",
    };

    const convertToBengaliNumber = (num) =>
        num
            .toString()
            .split("")
            .map((digit) => bengaliNumbers[digit])
            .join("");

    const day = convertToBengaliNumber(date.getDate());
    const month = months[date.getMonth()];
    const year = convertToBengaliNumber(date.getFullYear());

    const hours = convertToBengaliNumber(
        date.getHours().toString().padStart(2, "0")
    );
    const minutes = convertToBengaliNumber(
        date.getMinutes().toString().padStart(2, "0")
    );

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}