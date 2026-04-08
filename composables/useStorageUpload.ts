import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'

export const useStorageUpload = () => {
  const { $storage } = useNuxtApp()

  const uploadPublicationCover = async (file: File) => {
    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ_-]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const fileName = `${Date.now()}-${safeBaseName || 'cover'}.${extension || 'jpg'}`
    const fileRef = storageRef($storage, `publication-covers/${fileName}`)

    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)

    return {
      path: fileRef.fullPath,
      url: downloadURL
    }
  }

  return {
    uploadPublicationCover
  }
}
