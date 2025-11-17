export class BaseSelector {
  private constructor(
    readonly mode: 'categories' | 'profit' | 'remaining',
    readonly includeCategoryIds?: string[],
    readonly excludeCategoryIds?: string[],
    readonly includeIncome: boolean = true,
    readonly includeExpenses: boolean = true,
  ) {}

  static create(props: {
    mode: 'categories' | 'profit' | 'remaining';
    includeCategoryIds?: string[];
    excludeCategoryIds?: string[];
    includeIncome?: boolean;
    includeExpenses?: boolean;
  }) {
    // Domain invariants
    if (
      props.mode === 'categories' &&
      !props.includeCategoryIds?.length &&
      !props.excludeCategoryIds?.length
    ) {
      throw new Error('Category mode requires include/exclude categories.');
    }

    return new BaseSelector(
      props.mode,
      props.includeCategoryIds,
      props.excludeCategoryIds,
      props.includeIncome ?? true,
      props.includeExpenses ?? true,
    );
  }
}
