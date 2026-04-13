
import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { activities } from "@/components/start-my-trip/activities-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Trash2, Pencil, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Update type definitions to ensure consistent types
type Activity = {
  id: string | number; // Allow both string and number types for id
  title: string;
  location: string;
  rating: number;
  duration: string;
  description: string;
  image: string;
  tags: string[];
  price?: string;
};

type Accommodation = {
  id: string | number; // Allow both string and number types for id
  name: string;
  location: string;
  rating: number;
  image?: string;
};

// Mock data for hotels and guesthouses
const hotels: Accommodation[] = [
  { id: "1", name: "Four Seasons Hotel", location: "Tunis, Tunisia", rating: 5 },
  { id: "2", name: "Anantara Tozeur", location: "Tozeur, Tunisia", rating: 5 },
  { id: "3", name: "Movenpick Sousse", location: "Sousse, Tunisia", rating: 5 },
  { id: "4", name: "The Residence Tunis", location: "Tunis, Tunisia", rating: 5 },
  { id: "5", name: "Le Kasbah Kairouan", location: "Kairouan, Tunisia", rating: 5 },
  { id: "6", name: "Pansy KSAR Ghilene", location: "Ghilene, Tunisia", rating: 5 },
];

const guestHouses: Accommodation[] = [
  { id: "1", name: "Dar Ben Gacem", location: "Medina of Tunis, Tunisia", rating: 5 },
  { id: "2", name: "Dar Fatma", location: "Sidi Bou Said, Tunis, Tunisia", rating: 5 },
  { id: "3", name: "Dar Ellama", location: "Bizerte, Tunisia", rating: 5 },
];

const AdminTripPage = () => {
  // Cast the activities to match our updated Activity type
  const [activityList, setActivityList] = useState<Activity[]>(activities as Activity[]);
  const [hotelList, setHotelList] = useState<Accommodation[]>(hotels);
  const [guestHouseList, setGuestHouseList] = useState<Accommodation[]>(guestHouses);

  const [selectedItem, setSelectedItem] = useState<Activity | Accommodation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);
  const [currentTab, setCurrentTab] = useState("activities");

  const handleEditItem = (item: Activity | Accommodation) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = (updatedItem: Activity | Accommodation) => {
    if (currentTab === "activities") {
      setActivityList(
        activityList.map((item) => (item.id === updatedItem.id ? updatedItem as Activity : item))
      );
    } else if (currentTab === "hotels") {
      setHotelList(
        hotelList.map((item) => (item.id === updatedItem.id ? updatedItem as Accommodation : item))
      );
    } else if (currentTab === "guesthouses") {
      setGuestHouseList(
        guestHouseList.map((item) => (item.id === updatedItem.id ? updatedItem as Accommodation : item))
      );
    }
    setIsEditDialogOpen(false);
  };

  const handleAddNewItem = (newItem: Partial<Activity | Accommodation>) => {
    // Ensure id is always a string when we add new items for consistency
    const itemWithId = { ...newItem, id: String(Date.now()) };

    if (currentTab === "activities") {
      setActivityList([...activityList, itemWithId as Activity]);
    } else if (currentTab === "hotels") {
      setHotelList([...hotelList, itemWithId as Accommodation]);
    } else if (currentTab === "guesthouses") {
      setGuestHouseList([...guestHouseList, itemWithId as Accommodation]);
    }
    setIsAddDialogOpen(false);
  };

  const confirmDelete = (id: string | number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    if (currentTab === "activities") {
      setActivityList(activityList.filter(item => item.id !== itemToDelete));
    } else if (currentTab === "hotels") {
      setHotelList(hotelList.filter(item => item.id !== itemToDelete));
    } else if (currentTab === "guesthouses") {
      setGuestHouseList(guestHouseList.filter(item => item.id !== itemToDelete));
    }
    
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trip Management</h1>
            <p className="text-gray-600 mt-2">
              Manage activities, hotels, guesthouses, and other trip-related content.
            </p>
          </div>
        </div>

        <Tabs defaultValue="activities" onValueChange={setCurrentTab} className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="activities"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                Activities
              </TabsTrigger>
              <TabsTrigger 
                value="hotels"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                Hotels
              </TabsTrigger>
              <TabsTrigger 
                value="guesthouses"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                Guest Houses
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex justify-end my-4">
            <Button onClick={handleAddItem} className="flex items-center gap-2">
              <PlusCircle size={18} />
              Add New {currentTab === "activities" ? "Activity" : currentTab === "hotels" ? "Hotel" : "Guest House"}
            </Button>
          </div>

          <TabsContent value="activities" className="py-4">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle>Activities Management</CardTitle>
                <CardDescription>
                  Manage available activities for tourists in Tunisia.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No activities found. Add one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityList.map((activity) => (
                          <TableRow key={activity.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{activity.title}</TableCell>
                            <TableCell>{activity.location}</TableCell>
                            <TableCell>{activity.duration}</TableCell>
                            <TableCell>{renderRatingStars(activity.rating)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditItem(activity)}
                                  className="flex items-center gap-1"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => confirmDelete(activity.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="py-4">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle>Hotels Management</CardTitle>
                <CardDescription>
                  Manage hotel listings available on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotelList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No hotels found. Add one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        hotelList.map((hotel) => (
                          <TableRow key={hotel.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{hotel.name}</TableCell>
                            <TableCell>{hotel.location}</TableCell>
                            <TableCell>{renderRatingStars(hotel.rating)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditItem(hotel)}
                                  className="flex items-center gap-1"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => confirmDelete(hotel.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guesthouses" className="py-4">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle>Guest Houses Management</CardTitle>
                <CardDescription>
                  Manage guest house listings available on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestHouseList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No guest houses found. Add one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        guestHouseList.map((guestHouse) => (
                          <TableRow key={guestHouse.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{guestHouse.name}</TableCell>
                            <TableCell>{guestHouse.location}</TableCell>
                            <TableCell>{renderRatingStars(guestHouse.rating)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditItem(guestHouse)}
                                  className="flex items-center gap-1"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => confirmDelete(guestHouse.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit {currentTab === "activities" ? "Activity" : currentTab === "hotels" ? "Hotel" : "Guest House"}</DialogTitle>
            <DialogDescription>
              Make changes to your {currentTab === "activities" ? "activity" : currentTab === "hotels" ? "hotel" : "guest house"} details below.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto py-4">
              {currentTab === "activities" && 'title' in selectedItem ? (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="title" className="font-medium">Title</Label>
                    <Input
                      id="title"
                      defaultValue={selectedItem.title}
                      className="border-gray-300"
                      onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="location" className="font-medium">Location</Label>
                    <Input
                      id="location"
                      defaultValue={selectedItem.location}
                      className="border-gray-300"
                      onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="duration" className="font-medium">Duration</Label>
                    <Input
                      id="duration"
                      defaultValue={(selectedItem as Activity).duration}
                      className="border-gray-300"
                      onChange={(e) => setSelectedItem({ ...selectedItem, duration: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="description" className="font-medium">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue={(selectedItem as Activity).description}
                      className="border-gray-300 min-h-[100px]"
                      onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="rating" className="font-medium">Rating (1-5)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        defaultValue={selectedItem.rating}
                        className="border-gray-300 w-20"
                        onChange={(e) => setSelectedItem({ ...selectedItem, rating: Number(e.target.value) })}
                      />
                      <div className="flex items-center">
                        {renderRatingStars(selectedItem.rating)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name" className="font-medium">Name</Label>
                    <Input
                      id="name"
                      defaultValue={(selectedItem as Accommodation).name}
                      className="border-gray-300"
                      onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="location" className="font-medium">Location</Label>
                    <Input
                      id="location"
                      defaultValue={selectedItem.location}
                      className="border-gray-300"
                      onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="rating" className="font-medium">Rating (1-5)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        defaultValue={selectedItem.rating}
                        className="border-gray-300 w-20"
                        onChange={(e) => setSelectedItem({ ...selectedItem, rating: Number(e.target.value) })}
                      />
                      <div className="flex items-center">
                        {renderRatingStars(selectedItem.rating)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveEdit(selectedItem)}>Save Changes</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New {currentTab === "activities" ? "Activity" : currentTab === "hotels" ? "Hotel" : "Guest House"}</DialogTitle>
            <DialogDescription>
              Fill in the details for your new {currentTab === "activities" ? "activity" : currentTab === "hotels" ? "hotel" : "guest house"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto py-4">
            {currentTab === "activities" ? (
              <>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-title" className="font-medium">Title</Label>
                  <Input id="new-title" placeholder="Enter activity title" className="border-gray-300" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-location" className="font-medium">Location</Label>
                  <Input id="new-location" placeholder="Enter activity location" className="border-gray-300" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-duration" className="font-medium">Duration</Label>
                  <Input id="new-duration" placeholder="e.g., 2-3 hours" className="border-gray-300" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-description" className="font-medium">Description</Label>
                  <Textarea id="new-description" placeholder="Enter activity description" className="border-gray-300 min-h-[100px]" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-rating" className="font-medium">Rating (1-5)</Label>
                  <Input id="new-rating" type="number" min="1" max="5" defaultValue="4" className="border-gray-300 w-20" />
                </div>
                <DialogFooter className="pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const title = (document.getElementById('new-title') as HTMLInputElement).value;
                    const location = (document.getElementById('new-location') as HTMLInputElement).value;
                    const duration = (document.getElementById('new-duration') as HTMLInputElement).value;
                    const description = (document.getElementById('new-description') as HTMLTextAreaElement).value;
                    const rating = Number((document.getElementById('new-rating') as HTMLInputElement).value);
                    
                    if (!title || !location || !duration) {
                      alert("Please fill in all required fields.");
                      return;
                    }
                    
                    handleAddNewItem({
                      title,
                      location,
                      duration,
                      description,
                      rating,
                      tags: ['New', 'Activity'],
                      image: '/lovable-uploads/5d0e792c-e35e-43a4-ae97-71f48ca58d1d.png'
                    });
                  }}>
                    Add Activity
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-name" className="font-medium">Name</Label>
                  <Input id="new-name" placeholder={`Enter ${currentTab === "hotels" ? "hotel" : "guest house"} name`} className="border-gray-300" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-location" className="font-medium">Location</Label>
                  <Input id="new-location" placeholder="Enter location" className="border-gray-300" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-rating" className="font-medium">Rating (1-5)</Label>
                  <Input id="new-rating" type="number" min="1" max="5" defaultValue="5" className="border-gray-300 w-20" />
                </div>
                <DialogFooter className="pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const name = (document.getElementById('new-name') as HTMLInputElement).value;
                    const location = (document.getElementById('new-location') as HTMLInputElement).value;
                    const rating = Number((document.getElementById('new-rating') as HTMLInputElement).value);
                    
                    if (!name || !location) {
                      alert("Please fill in all required fields.");
                      return;
                    }
                    
                    handleAddNewItem({
                      name,
                      location,
                      rating,
                      image: '/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png'
                    });
                  }}>
                    Add {currentTab === "hotels" ? "Hotel" : "Guest House"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminTripPage;
