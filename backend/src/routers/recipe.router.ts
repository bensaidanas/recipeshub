import { Router } from "express";
import asyncHandler from "express-async-handler";
import { sample_recipes } from "../data";
import { RecipeModel } from "../models/recipe.model";

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
        const recipesCount = await RecipeModel.countDocuments();
        if (recipesCount > 0) {
            res.send("Seed is already done!");
            return;
        }

        await RecipeModel.create(sample_recipes);
        res.send("Seed is Done!")
    }
))

router.get("/", asyncHandler(
    async (req, res) => {
        const recipes = await RecipeModel.find();
        res.send(recipes);
    }
));

router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const recipes = await RecipeModel.find({title: {$regex: searchRegex}});
        res.send(recipes);
    }
));

router.get("/tags", asyncHandler(
    async (req, res) => {
        const tags = await RecipeModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({count: -1});

        // const all = {
        //     name: 'All',
        //     count: await RecipeModel.countDocuments()
        // }

        // tags.unshift(all);
        res.send(tags);
    }
));

router.get('/tag/:tagName', asyncHandler(
    async (req, res) => {
        const recipes = await RecipeModel.find({tags: req.params.tagName});
        res.send(recipes)
    }
));

router.get('/origin/:originName', asyncHandler(
    async (req, res) => {
        const recipes = await RecipeModel.find({origins: req.params.originName});
        res.send(recipes)
    }
));

router.get('/:recipeId', asyncHandler(
    async (req, res) => {
        const recipe = await RecipeModel.findById(req.params.recipeId);
        res.send(recipe)
    }
));

router.patch('/:recipeId', asyncHandler(async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
        res.status(404).json({message: 'Recipe not found'});
    }
    recipe!.favorite = !recipe!.favorite;
    const updatedRecipe = await recipe!.save();
    res.status(200).json(updatedRecipe);
}));

export default router;