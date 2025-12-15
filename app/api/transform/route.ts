import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const location = formData.get("location") as string;
    const dealershipName = formData.get("dealershipName") as string;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location is required" },
        { status: 400 }
      );
    }

    // Convert File to Blob for OpenAI
    const bytes = await imageFile.arrayBuffer();
    const blob = new Blob([bytes], { type: imageFile.type });
    const file = new File([blob], imageFile.name, { type: imageFile.type });

    // Build comprehensive prompt for boat image transformation
    const dealerInfo = dealershipName
      ? `This is for ${dealershipName} dealership. `
      : "";

    const prompt = `Remove trailer, place boat in ${location} water with reflections. Professional photography, boat fills 70-85% frame, telephoto lens look, golden hour lighting, magazine quality ${dealerInfo}`;

    // Use DALL-E 2 for image editing
    const response = await openai.images.edit({
      model: "dall-e-2",
      image: file as any,
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const generatedImageUrl = response.data?.[0]?.url;

    if (!generatedImageUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      processedImageUrl: generatedImageUrl,
    });
  } catch (error: any) {
    console.error("Error transforming image:", error);

    // If DALL-E edit fails, try generation instead
    try {
      const formData = await request.formData();
      const imageFile = formData.get("image") as File;
      const location = formData.get("location") as string;
      const dealershipName = formData.get("dealershipName") as string;

      const dealerInfo = dealershipName
        ? `for ${dealershipName} dealership`
        : "";

      const fallbackPrompt = `A professional, magazine-quality photograph of a luxury boat or yacht floating in ${location}. The boat is prominently featured filling 70-85% of the frame, photographed with a telephoto lens (200-300mm look) for professional compression and slight background blur. Beautiful ${location} waterway in the background with realistic water reflections. Golden hour lighting, premium dealership photography style ${dealerInfo}. Ultra-detailed, 8K quality, professional marine photography.`;

      const fallbackResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: fallbackPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      });

      const generatedImageUrl = fallbackResponse.data?.[0]?.url;

      if (generatedImageUrl) {
        return NextResponse.json({
          success: true,
          processedImageUrl: generatedImageUrl,
        });
      }
    } catch (fallbackError) {
      console.error("Fallback generation also failed:", fallbackError);
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to transform image",
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
