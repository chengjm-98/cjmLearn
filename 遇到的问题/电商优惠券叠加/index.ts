// ===============================
// 优惠券接口
// ===============================
interface ICoupon {
  apply(amount: number): number; // 输入原价，返回扣减后的金额
  name: string; // 优惠券名字
}

// ===============================
// 具体优惠券实现
// ===============================

// 满减券：满 100 减 20
class FullReductionCoupon implements ICoupon {
  name: string;
  threshold: number;
  discount: number;

  constructor(threshold: number, discount: number) {
    this.threshold = threshold;
    this.discount = discount;
    this.name = `满${threshold}减${discount}`;
  }

  apply(amount: number): number {
    if (amount >= this.threshold) {
      return amount - this.discount;
    }
    return amount;
  }
}

// 折扣券：直接打折，比如 9 折
class DiscountCoupon implements ICoupon {
  name: string;
  rate: number; // 0-1

  constructor(rate: number) {
    this.rate = rate;
    this.name = `${rate * 10}折`;
  }

  apply(amount: number): number {
    return amount * this.rate;
  }
}

// 现金券：固定金额抵扣
class CashCoupon implements ICoupon {
  name: string;
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
    this.name = `现金券${amount}`;
  }

  apply(amount: number): number {
    return Math.max(0, amount - this.amount);
  }
}

// ===============================
// 工厂
// ===============================
class CouponFactory {
  static create(type: string, config: any): ICoupon {
    switch (type) {
      case "fullReduction":
        return new FullReductionCoupon(config.threshold, config.discount);
      case "discount":
        return new DiscountCoupon(config.rate);
      case "cash":
        return new CashCoupon(config.amount);
      default:
        throw new Error("不支持的优惠券类型");
    }
  }
}

// ===============================
// 购物车结算
// ===============================
class Checkout {
  coupons: ICoupon[] = [];

  constructor(coupons: ICoupon[]) {
    this.coupons = coupons;
  }

  // 按顺序叠加优惠券
  calculate(originalAmount: number): {
    finalAmount: number;
    details: string[];
  } {
    let amount = originalAmount;
    const details: string[] = [];

    for (const coupon of this.coupons) {
      const before = amount;
      amount = coupon.apply(amount);
      details.push(
        `${coupon.name}: ${before.toFixed(2)} -> ${amount.toFixed(2)}`
      );
    }

    return { finalAmount: parseFloat(amount.toFixed(2)), details };
  }
}

// ===============================
// 使用示例
// ===============================

// 假设订单金额
const orderAmount = 300;

// 创建优惠券
const coupons: ICoupon[] = [
  CouponFactory.create("fullReduction", { threshold: 200, discount: 50 }),
  CouponFactory.create("discount", { rate: 0.9 }),
  CouponFactory.create("cash", { amount: 20 }),
];

// 结算
const checkout = new Checkout(coupons);
const result = checkout.calculate(orderAmount);

console.log("原始金额:", orderAmount);
console.log("优惠明细:");
result.details.forEach((d) => console.log(d));
console.log("最终金额:", result.finalAmount);
