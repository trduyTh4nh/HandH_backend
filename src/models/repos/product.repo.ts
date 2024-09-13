import { BadRequestError } from "../../core/error.response";
import { IColorProductVariation, IProduct, ISizeProductVarication } from "../../types/type.all";
import { _idConverted } from "../../utils";
import ProductModel from "../product.model";


const getAllProducts = async (): Promise<IProduct[] | null> => {
    const products = await ProductModel.find({})
    return products
}

const crearteProductFunc = async (
    product: IProduct
): Promise<IProduct> => {
    return await ProductModel.create(product)
}

const getProductById = async (idPro: string) => {
    const _id = _idConverted(idPro)

    return await ProductModel.findOne({ _id })
}

const publicProductFunc = async (idProduct: string) => {
    const _id = _idConverted(idProduct)

    return await ProductModel.findOneAndUpdate({ _id }, {
        $set: {
            isPublished: true
        }
    }, {})
}

const unPublicProductFunc = async (idProduct: string) => {
    const _id = _idConverted(idProduct)

    return await ProductModel.findOneAndUpdate({ _id }, {
        $set: {
            isPublished: false
        }
    }, {})
}

const draftProductFunc = async (idProduct: string) => {
    const _id = _idConverted(idProduct)

    return await ProductModel.findOneAndUpdate({ _id }, {
        $set: {
            isDraft: true
        }
    })
}

const unDraftProductFunc = async (idProduct: string) => {
    const _id = _idConverted(idProduct)

    return await ProductModel.findByIdAndUpdate({ _id }, {
        $set: {
            isDraft: false
        }
    })
}

const getPageProducts = async (page: number) => {
    const quantityProducerPerPage = 5
    const resutPage = await ProductModel.find({})
        .limit(quantityProducerPerPage)
        .skip(quantityProducerPerPage * (page - 1))

    return resutPage
}

const updateProductFunc = async (product: IProduct, id: string): Promise<any> => {

    if (product._id) {
        const foundProduct = await findProductById(product._id?.toString())

        if (!foundProduct) {
            throw new BadRequestError("Not found product to update!")
        }
    } else {
        throw new BadRequestError("Not found product to update!")
    }

    const {
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_slug,
        product_stock
    } = product

    const updateData: Partial<IProduct> = {}

    if (product_name) updateData.product_name = product_name
    if (product_thumb) updateData.product_thumb = product_thumb
    if (product_description) updateData.product_description = product_description
    if (product_price) updateData.product_price = product_price
    if (product_slug) updateData.product_slug = product_slug
    if (product_stock) updateData.product_stock = product_stock

    if (Object.keys(updateData).length > 0) {
        const updateProduct = await ProductModel.findByIdAndUpdate(_idConverted(id), updateData, { new: true })
        return updateProduct
    }
    else {
        throw new BadRequestError("No data to update!")
    }
}

const addSizeProductFunc = async (size: ISizeProductVarication, idProduct: string): Promise<any> => {
    const _id = _idConverted(idProduct)
    const findProductUpdate = await ProductModel.findOne({
        _id
    })

    if (!findProductUpdate) {
        throw new BadRequestError("Not found product to update!")
    }
    // có thể dùng some cho đỡ nhằn
    const arrSizeProduct: ISizeProductVarication[] = findProductUpdate.product_sizes
    const arrSize = arrSizeProduct.map(item => item.size_name)

    if (arrSize.includes(size.size_name)) {
        throw new BadRequestError('This size already exist!')
    }

    findProductUpdate.product_sizes.push(size)

    const updatedProduct = await findProductUpdate.save()

    return {
        id: updatedProduct._id,
        productSizes: updatedProduct.product_sizes
    }
}

const removeSizeProductFunc = async (size: string, idProduct: string): Promise<any> => {
    const _id = _idConverted(idProduct)
    const findProductUpdate = await ProductModel.findOne({
        _id
    })

    if (!findProductUpdate) {
        throw new BadRequestError("Not found product to update!")
    }


    findProductUpdate.product_sizes = findProductUpdate.product_sizes.filter((itemSize) => itemSize.size_name !== size)

    const updatedProduct = await findProductUpdate.save()

    return {
        id: updatedProduct._id,
        productSizes: updatedProduct.product_sizes
    }
}

const addColorProductFunc = async (color: IColorProductVariation, idProduct: string): Promise<any> => {
    const _id = _idConverted(idProduct)
    const findProductUpdate = await ProductModel.findOne({
        _id
    })

    if (!findProductUpdate) {
        throw new BadRequestError("Not found product to update!")
    }

    const arrColorProduct: IColorProductVariation[] = findProductUpdate.product_colors
    const arrColor = arrColorProduct.map(item => item.color_code)
    if (arrColor.includes(color.color_code)) {
        throw new BadRequestError("The code already exist!")
    }

    findProductUpdate.product_colors.push(color)

    const updatedProduct = await findProductUpdate.save()

    return {
        id: updatedProduct._id,
        productColors: updatedProduct.product_colors
    }
}



const removeColorProductFunc = async (color: string, idProduct: string): Promise<any> => {
    const _id = _idConverted(idProduct)
    const findProductUpdate = await ProductModel.findOne({
        _id
    })
    if (!findProductUpdate) {
        throw new BadRequestError("Not found product to update!")
    }
    findProductUpdate.product_colors = findProductUpdate.product_colors.filter((item) => item.color_code !== color)
    const updatedProduct = await findProductUpdate.save()
    return {
        id: updatedProduct._id,
        productColors: updatedProduct.product_colors
    }
}

const deleteProductFunc = async (idProduct: string): Promise<any> => {
    const _id = _idConverted(idProduct)
    const findProductUpdate = await ProductModel.findOne({
        _id
    })
    if (!findProductUpdate) {
        throw new BadRequestError("Not found product to update!")
    }

    if (findProductUpdate.isDraft === false) {
        throw new BadRequestError("This product is not a draft, if you want to remove it you must update it to a draft!")
    }

    return await ProductModel.deleteOne({ _id: _id })
}

const findProductById = async (idProduct: string): Promise<any> => {
    return await ProductModel.findOne({
        _id: _idConverted(idProduct)
    })
}
export {
    getAllProducts,
    crearteProductFunc,
    getProductById,
    publicProductFunc,
    unPublicProductFunc,
    draftProductFunc,
    unDraftProductFunc,
    getPageProducts,
    updateProductFunc,
    addSizeProductFunc,
    removeSizeProductFunc,
    addColorProductFunc,
    removeColorProductFunc,
    deleteProductFunc,
    findProductById
}