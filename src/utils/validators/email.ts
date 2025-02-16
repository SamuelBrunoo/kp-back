export const emailValidator = (email: string) => {
  email = email.replace(/^\s+|\s+$/g, "")

  email = email.replace(/\s+/g, " ")

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  return emailRegex.test(email)
}
