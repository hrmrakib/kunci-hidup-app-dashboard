"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, X, Plus } from "lucide-react"
import Image from "next/image"

interface Administrator {
  id: string
  name: string
  email: string
  phone: string
  role: "Admin" | "Super Admin"
  avatar: string
}

const mockAdministrators: Administrator[] = [
  {
    id: "#BI00001",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00002",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00003",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00004",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00005",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00006",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00007",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00008",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00009",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "#BI00010",
    name: "Hazel Janis",
    email: "janis202@gmail.com",
    phone: "+626-445-4928",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdministratorsPage() {
  const [administrators, setAdministrators] = useState<Administrator[]>(mockAdministrators)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin" as "Admin" | "Super Admin",
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(administrators.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAdministrators = administrators.slice(startIndex, endIndex)

  const handleAddAdmin = () => {
    setFormData({ name: "", email: "", phone: "", role: "Admin" })
    setIsAddModalOpen(true)
  }

  const handleEditAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin)
    setIsDeleteModalOpen(true)
  }

  const handleCreateAdmin = () => {
    if (formData.name && formData.email && formData.phone) {
      const newAdmin: Administrator = {
        id: `#BI${String(administrators.length + 1).padStart(5, "0")}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setAdministrators([...administrators, newAdmin])
      setIsAddModalOpen(false)
      setFormData({ name: "", email: "", phone: "", role: "Admin" })
    }
  }

  const handleUpdateAdmin = () => {
    if (selectedAdmin && formData.name && formData.email && formData.phone) {
      setAdministrators(
        administrators.map((admin) => (admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin)),
      )
      setIsEditModalOpen(false)
      setSelectedAdmin(null)
      setFormData({ name: "", email: "", phone: "", role: "Admin" })
    }
  }

  const confirmDeleteAdmin = () => {
    if (selectedAdmin) {
      setAdministrators(administrators.filter((admin) => admin.id !== selectedAdmin.id))
      setIsDeleteModalOpen(false)
      setSelectedAdmin(null)
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage, "...", totalPages)
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="text-gray-600"
        >
          {"<"}
        </Button>

        {pages.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className={page === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-600"}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="text-gray-600"
        >
          {">"}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Administrators</h1>
          <Button onClick={handleAddAdmin} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Administrator
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-orange-500 text-white">
            <div className="grid grid-cols-7 gap-4 p-4 font-medium">
              <div>Sl no.</div>
              <div>Profile</div>
              <div>Name</div>
              <div>Email</div>
              <div>Contact Number</div>
              <div>Has to Access</div>
              <div>Action</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {currentAdministrators.map((admin) => (
              <div key={admin.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50">
                <div className="text-sm text-gray-600">{admin.id}</div>
                <div>
                  <Image
                    src={admin.avatar || "/placeholder.svg"}
                    alt={admin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="font-medium text-gray-900">{admin.name}</div>
                <div className="text-gray-600">{admin.email}</div>
                <div className="text-gray-600">{admin.phone}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      admin.role === "Super Admin" ? "text-blue-600 bg-blue-50" : "text-green-600 bg-green-50"
                    }`}
                  >
                    {admin.role}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAdmin(admin)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAdmin(admin)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentAdministrators.map((admin) => (
            <div key={admin.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={admin.avatar || "/placeholder.svg"}
                    alt={admin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditAdmin(admin)} className="text-gray-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAdmin(admin)} className="text-gray-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900">{admin.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{admin.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      admin.role === "Super Admin" ? "text-blue-600 bg-blue-50" : "text-green-600 bg-green-50"
                    }`}
                  >
                    {admin.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {renderPagination()}

        {/* Add Administrator Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">Add New Administrator</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-4 top-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name:</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-email">Email:</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number:</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-role">Role:</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "Admin" | "Super Admin") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Administrator Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">Edit Administrator</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="absolute right-4 top-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name:</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-orange-50 border-orange-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email:</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number:</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role:</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "Admin" | "Super Admin") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateAdmin} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Edit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute right-4 top-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>

            <div className="text-center py-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Are You Sure?</h3>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteAdmin}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
