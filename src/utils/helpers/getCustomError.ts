export const getCustomError = (error: any) => {
  console.log(error)
  
  try {
    const errorObj = JSON.parse((error as any).message)

    return {
      success: false,
      error: errorObj.message,
    }
  } catch (error) {
    return {
      success: false,
      error: "Houve um erro. Tente novamente",
    }
  }
}

export const jsonError = (message: string) => JSON.stringify({ message })
