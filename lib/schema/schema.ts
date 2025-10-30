import * as z from "zod"

export const weddingFormSchema = z.object({
  groomName: z.string().min(1, "Required"),
  brideName: z.string().min(1, "Required"),
  eventDate: z.string().min(1, "Required"),
  themeColor: z.string().optional(),
  message: z.string().optional(),
})

export type weddingFormSchema = z.infer<typeof weddingFormSchema>