import React, { useEffect, useState } from "react";
import { db, auth } from "../../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { pink, red } from "@mui/material/colors";

interface PantryItem {
  id: string;
  name: string;
  qty: number;
  category: string;
  dateAdded: string;
  expiryDate: string;
  expiryStatus: string;
}

interface Recipe {
  id: string;
  pantryItems: PantryItem[];
  recipe: string;
  createdAt: string;
}

const SavedRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<string>("");

  const fetchRecipes = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const recipesRef = collection(db, `userData/${user.uid}/recipes`);
        const snapshot = await getDocs(recipesRef);
        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  };

  const handleExpandClick = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleEditClick = (id: string, recipe: string) => {
    setEditing(id);
    setEditedRecipe(recipe);
  };

  const handleSaveClick = async (id: string) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const recipeRef = doc(db, `userData/${user.uid}/recipes`, id);
        await updateDoc(recipeRef, { recipe: editedRecipe });
        setEditing(null);
        fetchRecipes();
      } catch (error) {
        console.error("Error updating recipe:", error);
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const recipeRef = doc(db, `userData/${user.uid}/recipes`, id);
        await deleteDoc(recipeRef);
        fetchRecipes();
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Saved Recipes
      </Typography>
      {recipes.map((recipe) => (
        <Card key={recipe.id} sx={{ mb: 4 }}>
          <CardContent sx={{ bgcolor: red[100] }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Recipe created on: {new Date(recipe.createdAt).toLocaleString()}
              </Typography>
              <IconButton onClick={() => handleExpandClick(recipe.id)}>
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={expanded === recipe.id} timeout="auto" unmountOnExit>
              {editing === recipe.id ? (
                <TextField
                  fullWidth
                  multiline
                  value={editedRecipe}
                  onChange={(e) => setEditedRecipe(e.target.value)}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-line", mb: 2 }}
                >
                  {recipe.recipe}
                </Typography>
              )}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Ingredients:
              </Typography>
              <ul>
                {recipe.pantryItems.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.qty} {item.category}
                  </li>
                ))}
              </ul>
              <Box display="flex" justifyContent="flex-end">
                {editing === recipe.id ? (
                  <Button
                    onClick={() => handleSaveClick(recipe.id)}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ mr: 2 }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEditClick(recipe.id, recipe.recipe)}
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon />}
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => handleDeleteClick(recipe.id)}
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SavedRecipes;
