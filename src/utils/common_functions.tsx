import React from "react";

export default function formatText({ name }: { name: string }) {
  if (!name) return;

  const withoutDate = name.replace(/\d{4}[-_]\d{2}[-_]\d{2}/g, '');
  const nonUnderscoreName = withoutDate.replace(/_/g, " ");

  const firstSpaceIndex = nonUnderscoreName.indexOf(" ");
  if (firstSpaceIndex === -1) {
    return (
      nonUnderscoreName.charAt(0).toUpperCase() + nonUnderscoreName.slice(1)
    );
  } else {
    const firstWord = nonUnderscoreName.substring(0, firstSpaceIndex);
    const restOfString = nonUnderscoreName.substring(firstSpaceIndex);
    return (
      firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + restOfString
    );
  }
}
