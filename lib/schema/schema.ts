import * as z from "zod"

export const weddingFormSchema = z.object({
  animationColor:z.string().min(1,"animation color is required"),
  animationEffect:z.string().min(1,"Required animation effect"),
  fontColor:z.string().min(1,"Required Font Color"),
  visualId: z.string().min(1,"Required visual id"),
  doorStyle:z.string().min(1,"Required door style"),
  choosedPackage: z.string().min(1, "Required"),
  isCustomDesign: z.boolean(),
  isCustomVideoCover:z.boolean(),
  groomName: z.string().min(1, "Required"),
  brideName: z.string().min(1, "Required"),
  eventDate: z.string().min(1, "Required"),
  themeColor: z.string().optional(),
  message: z.string().optional(),
})

export type WeddingFormSchema = z.infer<typeof weddingFormSchema>