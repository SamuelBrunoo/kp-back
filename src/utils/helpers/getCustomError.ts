export const getCustomError = (error: any) => {
  try {
    const msg = error.message

    return {
      success: false,
      error: msg,
    }
  } catch (error) {
    return {
      success: false,
      error: "Houve um erro. Tente novamente",
    }
  }
}

export const jsonError = (message: string) => JSON.stringify({ message })
