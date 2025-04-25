import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import axios from "axios"
import { toast } from "sonner"



function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

const PublishBook = () => {

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [year, setYear] = useState("")
  const [author, setAuthor] = useState("")

  const handleBookUpload = async () => {

    if (!file) {
      toast.error("📂 Please select a file to upload.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("genre", genre)
    formData.append("year", year)
    formData.append("author", author)

    try {
      const response = await axios.post('/api/books/upload', formData)
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success("Book uploaded succesfully")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error)
      } else {
        toast.error("An error occured while uploading the book. Please try again")
      }
    }

  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto w-full">
      <Card className="">
        <CardTitle className="flex justify-center items-center text-2xl">
          Publish a book
        </CardTitle>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
            <span className="text-xs text-gray-500">.pdf</span>
          </div>
          <div className="space-y-2 text-sm flex flex-col gap-2">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Input id="Title" type="text" placeholder="Name of book" onChange={(e) => setTitle(e.target.value)} />
            <Input id="Genre" type="text" placeholder="Genre" onChange={(e) => setGenre(e.target.value)} />
            <Input id="Publication year" type="text" placeholder="Publication Year" onChange={(e) => setYear(e.target.value)} />
            <Input id="Author" type="text" placeholder="Author" onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onCanPlay={handleBookUpload}>Upload</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PublishBook
