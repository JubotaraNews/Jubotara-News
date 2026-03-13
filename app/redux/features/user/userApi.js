import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ------------------ API Slice ------------------ */

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  tagTypes: ["Users"],

  endpoints: (builder) => ({
    /* ------------------ GET USERS ------------------ */
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    /* ------------------ REGISTER USER ------------------ */
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `/register`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    /* ------------------ UPDATE ROLE ------------------ */
    updateRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    /* ------------------ DELETE USER ------------------ */
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

/* ------------------ HOOK EXPORT ------------------ */

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useUpdateRoleMutation,
  useDeleteUserMutation,
} = userApi;
