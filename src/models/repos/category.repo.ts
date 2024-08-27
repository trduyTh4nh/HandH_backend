import { BadRequestError } from "../../core/error.response";
import { ICategory } from "../../types/type.all";
import { _idConverted } from "../../utils";
import Category from "../category.model";


const createCategoryFunc = async (category: ICategory)
    : Promise<ICategory> => {
    return await Category.create(category)
}

const getAllCategoryFunc = async ()
    : Promise<ICategory[]> => {
    const categories = await Category.find({})
    return categories
}

const getACategoryFunc = async (_id: string): Promise<any> => {
    return await Category.findOne({
        _id: _idConverted(_id)
    })
}

const deleteCategoryFunc = async (_id: string): Promise<any> => {
    return await Category.deleteOne({
        _id: _idConverted(_id)
    })
}

const updateCategoryFunc = async (category: ICategory, id: string): Promise<any> => {
    const { category_description, category_image, category_name, category_total } = category

    const updateData: Partial<ICategory> = {}

    if (category_description) updateData.category_description = category_description;
    if (category_image) updateData.category_image = category_image
    if (category_name) updateData.category_name = category_name
    if (category_total !== undefined) updateData.category_total = category_total

    if (Object.keys(updateData).length > 0) {
        const updateCategory = await Category.findByIdAndUpdate(_idConverted(id), updateData, { new: true })
        return updateCategory
    }
    else {
        throw new BadRequestError("No data to update");
    }


}

export {
    createCategoryFunc,
    getAllCategoryFunc,
    getACategoryFunc,
    deleteCategoryFunc,
    updateCategoryFunc
}