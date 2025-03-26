// file: src/features/comments/ui/CommentList.tsx
// This file demonstrates invalid public API imports

// Invalid import - should use public API instead of direct import
import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slice.ts';

// Invalid import - should use public API
import { ArticleCard } from 'entities/Article/ui/ArticleCard/ArticleCard.tsx';

// Valid imports
import { Button } from 'shared/ui/Button';
import { formatDate } from 'shared/lib/formatDate';

export const CommentList = () => {
  return (
    <div>
      <h2>Comments</h2>
      <ArticleCard />
      <Button onClick={() => addCommentFormActions.reset()}>Reset</Button>
    </div>
  );
};