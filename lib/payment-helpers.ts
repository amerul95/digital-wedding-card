import prisma from "@/lib/prisma"

/**
 * Updates designer wallet balance when a ThemeSale is created
 * Splits payment: 15% to designer, 85% to company
 * This should be called after creating a ThemeSale record
 */
export async function updateDesignerWalletOnSale(themeSaleId: string) {
  try {
    const themeSale = await prisma.themeSale.findUnique({
      where: { id: themeSaleId },
      include: {
        designer: true,
      },
    })

    if (!themeSale) {
      throw new Error("ThemeSale not found")
    }

    // Add designer earning to wallet (15% of sale price)
    await prisma.designer.update({
      where: { id: themeSale.designerId },
      data: {
        walletBalance: {
          increment: themeSale.designerEarning,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating designer wallet:", error)
    throw error
  }
}

/**
 * Creates ThemeSale record and updates designer wallet
 * This is a helper function that should be called when a cart is completed
 */
export async function createThemeSaleAndUpdateWallet(data: {
  themeId: string
  productId: string
  cartId: string
  salePrice: number
  designerId: string
}) {
  const { themeId, productId, cartId, salePrice, designerId } = data

  // Calculate split: 15% designer, 85% company
  const designerEarning = salePrice * 0.15
  const companyEarning = salePrice * 0.85

  // Create ThemeSale record
  const themeSale = await prisma.themeSale.create({
    data: {
      themeId,
      productId,
      cartId,
      salePrice,
      designerEarning,
      companyEarning,
      designerId,
    },
  })

  // Update designer wallet
  await prisma.designer.update({
    where: { id: designerId },
    data: {
      walletBalance: {
        increment: designerEarning,
      },
    },
  })

  return themeSale
}


