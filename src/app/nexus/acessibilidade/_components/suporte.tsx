"use client";

export const scaleLabel = (scale: number) => {
	if (scale === 0) return "Padrão";
	return scale > 0 ? `+${scale} níveis` : `${scale} níveis`;
};
