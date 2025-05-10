"use client";

import { useLoadingStore } from "@/store/ui/loadingStore";
import { CircularProgress, styled } from "@mui/material";

const Loading = () => {
  const { isLoading } = useLoadingStore();

  if (isLoading) {
    return (
      <>
        <LoadingCircle />
      </>
    );
  }

  return null;
};

export default Loading;

const LoadingCircle = styled(CircularProgress)`
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
`;
