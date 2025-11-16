import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// DELETE CONTENT
router.delete("/content/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("contents")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// DELETE PROFILE
router.delete("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("profile")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

export default router;
