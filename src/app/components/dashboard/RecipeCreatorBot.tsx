"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import OpenAI from "openai";
import { auth } from "../../../config/firebase";
import { db } from "../../../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

interface PantryItem {
  id: string; // ID must be a string as Firestore IDs are strings
  name: string;
  qty: number;
  category: string;
  dateAdded: string;
  expiryDate: string;
  expiryStatus: string;
}

const RecipeCreatorBot: React.FC<{ pantryItems: PantryItem[] }> = ({
  pantryItems,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<string>("");

  const openaiApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  if (!openaiApiKey) {
    console.error("OpenAI API key is not set in environment variables.");
    return null;
  }

  const openai = new OpenAI({
    baseURL: "https://api.openai.com/v1",
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": "",
      "X-Title": "",
    },
  });

  const fetchRecipe = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate a recipe using these ingredients: ${JSON.stringify(
              pantryItems
            )}`,
          },
        ],
      });

      if (response.choices && response.choices.length > 0) {
        const recipe = response.choices[0].message.content;
        return recipe;
      } else {
        console.error("No choices returned in the response:", response);
        return "Sorry, no recipe could be generated. Please try again later.";
      }
    } catch (error) {
      console.error("Error fetching recipe from API:", error);
      return "Sorry, something went wrong. Please try again later.";
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const response = await fetchRecipe();
    setRecipe(response);
    setLoading(false);
  };

  const handleClose = () => setOpen(false);

  const saveRecipe = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const recipeData = {
          pantryItems,
          recipe,
          createdAt: new Date().toISOString(),
        };
        const recipesRef = collection(db, `userData/${user.uid}/recipes`);
        await addDoc(recipesRef, recipeData);
        alert("Recipe saved successfully!");
        handleClose();
      } catch (error) {
        console.error("Error saving recipe:", error);
        alert("There was an error saving the recipe. Please try again.");
      }
    } else {
      alert("User not authenticated.");
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="error"
        sx={{ mt: 9 }}
      >
        Generate Recipe
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recipe Generator
          </Typography>
          <Box sx={{ maxHeight: "300px", overflowY: "auto", mb: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography sx={{ whiteSpace: "pre-line" }}>{recipe}</Typography>
            )}
          </Box>
          <Button onClick={saveRecipe} variant="contained" sx={{ mr: 2 }}>
            Save Recipe
          </Button>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  fontFamily: "Poppins",
};

export default RecipeCreatorBot;
