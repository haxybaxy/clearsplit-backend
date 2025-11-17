export enum BaseSource {
  IncomeComponents = 'income_components',
  ExpenseComponents = 'expense_components',
  BothComponents = 'both_components',
  Profit = 'profit',
  Remaining = 'remaining',
}

export class BaseSelector {
  private constructor(
    readonly source: BaseSource,
    readonly includeCategoryIds?: string[],
    readonly excludeCategoryIds?: string[],
  ) {}

  static create(props: {
    source: BaseSource;
    includeCategoryIds?: string[];
    excludeCategoryIds?: string[];
  }) {
    const isCategoryBased =
      props.source === BaseSource.IncomeComponents ||
      props.source === BaseSource.ExpenseComponents ||
      props.source === BaseSource.BothComponents;

    const isProfitOrRemaining =
      props.source === BaseSource.Profit ||
      props.source === BaseSource.Remaining;

    if (
      isProfitOrRemaining &&
      (props.includeCategoryIds?.length || props.excludeCategoryIds?.length)
    ) {
      throw new Error(
        'Profit or Remaining sources cannot include category filters.',
      );
    }

    if (isCategoryBased) {
      // undefined / empty is interpreted as “all categories of that type”
      props.includeCategoryIds = props.includeCategoryIds?.length
        ? props.includeCategoryIds
        : undefined;
      props.excludeCategoryIds = props.excludeCategoryIds?.length
        ? props.excludeCategoryIds
        : undefined;
    }

    return new BaseSelector(
      props.source,
      props.includeCategoryIds,
      props.excludeCategoryIds,
    );
  }

  // --- Convenience getters ---
  get isCategoryBased() {
    return (
      this.source === BaseSource.IncomeComponents ||
      this.source === BaseSource.ExpenseComponents ||
      this.source === BaseSource.BothComponents
    );
  }

  get isProfitBased() {
    return this.source === BaseSource.Profit;
  }

  get isRemainingBased() {
    return this.source === BaseSource.Remaining;
  }

  // Helper to check if it should include all categories
  get appliesToAllCategories() {
    return (
      this.isCategoryBased &&
      !this.includeCategoryIds &&
      !this.excludeCategoryIds
    );
  }
}
