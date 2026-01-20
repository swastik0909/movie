import userApi from "./userApi";

export const addComment = (data: {
  mediaId: string;
  mediaType: "movie" | "tv";
  text: string;
}) => userApi.post("/comments", data);

export const getComments = (
  mediaId: string,
  mediaType: "movie" | "tv"
) =>
  userApi.get("/comments", {
    params: { mediaId, mediaType },
  });

export const reactComment = (
  id: string,
  type: "like" | "dislike"
) => userApi.post(`/comments/${id}/react`, { type });

export const deleteComment = (id: string) =>
  userApi.delete(`/comments/${id}`);

export const reportComment = (id: string, reason: string) =>
  userApi.post(`/comments/${id}/report`, { reason });

/* ADMIN */
export const getReportedComments = () =>
  userApi.get("/comments/admin/reports");

export const toggleHideComment = (id: string) =>
  userApi.put(`/comments/admin/${id}/hide`);
