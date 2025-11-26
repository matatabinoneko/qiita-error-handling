"use client";

import { useState, useRef } from "react";
import { CustomError, errorCode, ErrorCode } from "@/lib/errors";
import { z } from "zod";

// Repository: ユーザー検索
const searchUserResponseSchema = z.union([
  z.object({
    isSuccess: z.literal(true),
    user: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  z.object({
    isSuccess: z.literal(false),
    errorCode: z.literal(errorCode),
  }),
]);
async function searchUserRepository(userId: string) {
  const response = await fetch("/api/search/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = searchUserResponseSchema.parse(await response.json());
  if (!data.isSuccess) {
    throw new CustomError(data.errorCode);
  }
  return data.user;
}

// Repository: ユーザーフォロー
// カスタムエラーを投げる
async function followUserRepository(userId: string) {
  const response = await fetch(`/api/user/${userId}/follow`, {
    method: "POST",
  });
  if (!response.ok) {
    const { errorCode } = await response.json();
    if (errorCode) {
      throw new CustomError(errorCode as ErrorCode);
    }
    // errorCodeがない場合のフォールバック
    if (response.status === 404) {
      throw new CustomError("not-found");
    }
    throw new CustomError("unexpected-error");
  }
}

// カスタムフック: useUserSearch
function useUserSearch() {
  const [searchError, setSearchError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  const searchUser = async (userId: string) => {
    setSearchError(null);
    setUser(null);

    // catch文によるエラーハンドリング
    try {
      const user = await searchUserRepository(userId);
      setUser(user);
    } catch (error) {
      if (error instanceof CustomError) {
        switch (error.code) {
          case "bad-request":
            setSearchError("パラメータが不正です");
            return;
          case "not-found":
            setSearchError("ユーザーが見つかりません");
            return;
        }
      }
      setSearchError("検索に失敗しました");
    }
  };

  return {
    searchUser,
    searchError,
    user,
  };
}

// カスタムフック: useFollowUser
function useFollowUser() {
  const [followError, setFollowError] = useState<string | null>(null);

  const followUser = async (userId: string) => {
    setFollowError(null);

    try {
      // catch文によるエラーハンドリング
      await followUserRepository(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        switch (error.code) {
          case "bad-request/already-followed":
            setFollowError("既にフォロー済みです");
            return;
          case "bad-request":
            setFollowError("パラメータが不正です");
            return;
          case "not-found":
            setFollowError("ユーザーが見つかりません");
            return;
        }
      }
      setFollowError("フォローに失敗しました");
    }
  };

  const reset = () => {
    setFollowError(null);
  };

  return {
    followUser,
    followError,
    reset,
  };
}

// ユーザー検索ページコンポーネント
export default function SearchPage() {
  const userIdRef = useRef<HTMLInputElement>(null);
  const { searchUser, searchError, user } = useUserSearch();

  const { followUser, followError, reset: resetFollowError } = useFollowUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = userIdRef.current?.value.trim();
    if (userId) {
      resetFollowError();
      await searchUser(userId);
    }
  };

  const handleFollow = async () => {
    if (user) {
      await followUser(user.id);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>ユーザー検索</h1>

      <form onSubmit={handleSearch} style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="userId"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            User ID:
          </label>
          <input
            id="userId"
            type="text"
            ref={userIdRef}
            placeholder="ユーザーIDを入力"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          検索
        </button>
      </form>

      {searchError && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c00",
          }}
        >
          <strong>❌ エラー:</strong> {searchError}
        </div>
      )}

      {followError && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c00",
          }}
        >
          <strong>❌ エラー:</strong> {followError}
        </div>
      )}

      {user && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>検索結果</h2>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>名前:</strong> {user.name}
          </p>
          <button
            onClick={handleFollow}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            フォロー
          </button>
        </div>
      )}
    </div>
  );
}
