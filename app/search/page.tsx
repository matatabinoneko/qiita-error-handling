"use client";

import { useState, useRef } from "react";
import {
  BadRequestError,
  NotFoundError,
  UnexpectedError,
} from "@/lib/errors";

// Repository: ユーザー検索
async function searchUserRepository(
  userId: string
): Promise<{ id: string; name: string }> {
  const response = await fetch("/api/search/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new BadRequestError("パラメータが不正です");
    }
    if (response.status === 404) {
      throw new NotFoundError("ユーザーが見つかりません");
    }
    throw new UnexpectedError("検索に失敗しました");
  }

  const data = await response.json();
  return data.user;
}

// Repository: ユーザーフォロー
// Result型を使って返却する
async function followUserRepository(userId: string) {
  const response = await fetch(`/api/user/${userId}/follow`, {
    method: "POST",
  });
  if (!response.ok) {
    // statusで判定
    if (response.status === 404) {
      return { isSuccess: false, errorCode: "user-not-found" };
    }
    // errorCodeで判定
    const { errorCode } = await response.json();
    if (errorCode === 400) {
      return { isSuccess: false, errorCode: "invalid-parameter" };
    } else if (errorCode === 4002) {
      return { isSuccess: false, errorCode: "already-followed" };
    } else {
      return { isSuccess: false, errorCode: "follow-failed" };
    }
  }
  return { isSuccess: true };
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
      if (error instanceof BadRequestError) {
        setSearchError("パラメータが不正です");
      } else if (error instanceof NotFoundError) {
        setSearchError("ユーザーが見つかりません");
      } else {
        setSearchError("検索に失敗しました");
      }
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
      // Result型によるエラーハンドリング
      const result = await followUserRepository(userId);
      if (!result.isSuccess) {
        switch (result.errorCode) {
          case "user-not-found":
            setFollowError("ユーザーが見つかりません");
            break;
          case "already-followed":
            setFollowError("既にフォロー済みです");
            break;
          case "invalid-parameter":
            setFollowError("パラメータが不正です");
            break;
          case "follow-failed":
          default:
            setFollowError("フォローに失敗しました");
            break;
        }
      }
    } finally {
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
