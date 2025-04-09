export const isValidImageUrl = (url) => {
    return typeof url === "string" && url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i);
};
