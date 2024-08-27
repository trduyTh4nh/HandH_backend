import { update } from "lodash";
import { BadRequestError } from "../core/error.response";
import { createCategoryFunc, deleteCategoryFunc, getACategoryFunc, getAllCategoryFunc, updateCategoryFunc } from "../models/repos/category.repo";
import { ICategory } from "../types/type.all";

// có thể tạo ra interface để ràng buộc class có thể có bao nhiêu function example:

// interface ICategoryService {
//     createCate(data: any): Promise<{}>;
//     createCate2(data: any): Promise<{}>;
//     createCate3(data: any): Promise<{}>;
// }

// sau đó implement vào class Service là được
class CategoryService {
    static async createCategory(category: ICategory): Promise<any> {

        const { category_name, category_description, category_image } = category

        if (!category_name || !category_description || !category_image) {
            throw new BadRequestError('Missing some fields!')
        }
        return await createCategoryFunc(category)
    }


    static async getAllCategory(): Promise<any> {
        return await getAllCategoryFunc()
        // viết hàm sẵn bên repo rồi giờ implement vào thôi
    }
    static async getACategory(idCate: string): Promise<any> {
        if (!idCate) {
            throw new BadRequestError("Missing category fields")
        }
        return await getACategoryFunc(idCate)
    }

    static async deleteCategory(idCate: string): Promise<any> {
        return await deleteCategoryFunc(idCate)
    }

    static async updateCategory(newCate: ICategory, idCate: string): Promise<ICategory> {
        return await updateCategoryFunc(newCate, idCate)
    }

}

export default CategoryService