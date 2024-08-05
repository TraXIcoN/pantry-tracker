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

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const response = await fetchRecipe();
    setMessages([`Bot: ${response}`]);
    setLoading(false);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    setMessages([]);
  }, []);

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
              messages.map((message, index) => (
                <Typography key={index} sx={{ whiteSpace: "pre-line" }}>
                  {message}
                </Typography>
              ))
            )}
          </Box>
          <Button color="error" onClick={handleClose} variant="contained">
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
