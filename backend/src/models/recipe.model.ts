import { Schema, model } from "mongoose";

export interface Recipe {
    id: string;
    title: string;
    description: string;
    calories: number;
    stars: number;
    favorite: boolean;
    vegan: boolean;
    freeSugar: boolean;
    imageUrl: string;
    cookTime: string;
    yield: string;
    instructions: string[];
    ingredients: string[];
    tags: string[];
    origins: string[];
}

export const RecipeSchema = new Schema<Recipe>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        calories: {type: Number, required: true},
        stars: {type: Number, required: true},
        favorite: {type: Boolean, default: false},
        vegan: {type: Boolean, default: false},
        freeSugar: {type: Boolean, default: false},
        imageUrl: {type: String, required: true},
        cookTime: {type: String, required: true},
        yield: {type: String},
        instructions: {type: [String], required: true},
        ingredients: {type: [String], required: true},
        tags: {type: [String]},
        origins: {type: [String], required: true}
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const RecipeModel = model<Recipe>('recipe', RecipeSchema);