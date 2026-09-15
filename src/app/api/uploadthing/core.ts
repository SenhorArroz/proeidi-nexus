import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "~/server/auth";

const f = createUploadthing();

export const ourFileRouter = {
	avisoImagem: f(
		{ image: { maxFileSize: "4MB", maxFileCount: 1 } },
		{ awaitServerData: false },
	)
		.middleware(async () => {
			const session = await auth();
			if (!session?.user?.id) throw new Error("Não autorizado");
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
