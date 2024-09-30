import { identity, size } from "lodash";
import { BadRequestError } from "../core/error.response";
import {
  addColorProductFunc,
  addSizeProductFunc,
  crearteProductFunc,
  deleteProductFunc,
  draftProductFunc,
  getAllProducts,
  getPageProducts,
  getProductById,
  publicProductFunc,
  removeColorProductFunc,
  removeSizeProductFunc,
  searchProductByFilterFunc,
  searchProductFunc,
  unDraftProductFunc,
  unPublicProductFunc,
  updateImageForProductFunc,
  updateProductFunc,
} from "../models/repos/product.repo";
import {
  ICategory,
  IColorProductVariation,
  IProduct,
  ISizeProductVarication,
  ITypeFilter,
} from "../types/type.all";

class ProductService {
  // nhớ phân trang khi lấy all product về
  static async getAllProduct(): Promise<any> {
    const listProduct = await getAllProducts();
    return listProduct;
  }

  static async createProduct(product: IProduct): Promise<any> {
    const {
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_sizes,
      product_colors,
    } = product;

    if (
      !product_name ||
      !product_thumb ||
      !product_description ||
      !product_price ||
      !product_category
    ) {
      throw new BadRequestError("Missing required fields");
    }

    if (product_price <= 0) {
      throw new BadRequestError("Price must > 0");
    }

    return await crearteProductFunc(product);
  }

  static async publicProduct(idProduct: string): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing id product!");
    }

    const foundProduct = await getProductById(idProduct);
    if (!foundProduct) {
      throw new BadRequestError("Not found product!");
    }

    return await publicProductFunc(idProduct);
  }

  static async unPublicProduct(idProduct: string): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing some data");
    }

    const foundProduct = await getProductById(idProduct);
    if (!foundProduct) {
      throw new BadRequestError("Not found product to draft!");
    }

    return await unPublicProductFunc(idProduct);
  }

  static async daftProduct(idProduct: string): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing sone data!");
    }
    const foundProduct = await getProductById(idProduct);
    if (!foundProduct) {
      throw new BadRequestError("Not found product to draft!");
    }

    return await draftProductFunc(idProduct);
  }

  static async unDaftProduct(idProduct: string): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing sone data!");
    }
    const foundProduct = await getProductById(idProduct);
    if (!foundProduct) {
      throw new BadRequestError("Not found product to draft!");
    }

    return await unDraftProductFunc(idProduct);
  }

  static async getProductsWithPage(
    numPage: number,
    quantityPerpage: number
  ): Promise<any> {
    if (!numPage) {
      throw new BadRequestError("Can not find page!");
    }
    const pageFound: number = numPage >= 1 ? numPage : 1;
    return await getPageProducts(pageFound, quantityPerpage);
  }

  static async updateProduct(
    newProduct: IProduct,
    idPro: string
  ): Promise<any> {
    return await updateProductFunc(newProduct, idPro);
  }

  static async addSizeProduct(data: {
    size: ISizeProductVarication;
    id: string;
  }): Promise<any> {
    return await addSizeProductFunc(data.size, data.id);
  }

  static async removeSizeProduct(payload: {
    size: string;
    idPro: string;
  }): Promise<any> {
    return await removeSizeProductFunc(payload.size, payload.idPro);
  }

  static async addColorProduct(data: {
    color: IColorProductVariation;
    id: string;
  }): Promise<any> {
    return await addColorProductFunc(data.color, data.id);
  }

  static async removeColorProduct(payload: {
    color: string;
    idPro: string;
  }): Promise<any> {
    return await removeColorProductFunc(payload.color, payload.idPro);
  }

  static async deleteProductForever(id: string): Promise<any> {
    return await deleteProductFunc(id);
  }

  static async searchProduct(query: string): Promise<any> {
    return await searchProductFunc(query);
  }

  static async uploadImageForProduct(
    idProduct: string,
    file: any
  ): Promise<any> {
    return await updateImageForProductFunc(idProduct, file);
  }

  static async searchProductByFilterService(
    filter: ITypeFilter,
    numPage: number,
    pageSize: number
  ): Promise<any> {
    const { maximumPrice, minimumPrice } = filter;

    // if (!numPage) {
    //   throw new BadRequestError("Can not find page!");
    // }

    const pageFound: number = numPage >= 1 ? numPage : 1;
    const pageCount = pageSize ? pageSize : 0;
    if (maximumPrice < minimumPrice) {
      throw new BadRequestError("maximum price must larger than minimum price");
    }

    return await searchProductByFilterFunc(filter, pageFound, pageCount);
  }
}

export default ProductService;
