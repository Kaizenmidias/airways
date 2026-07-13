<?php

namespace App\Services\Course;

use App\Models\Course\CourseLearning;

class CourseLearningService
{
   public function createLearning(array $data)
   {
      return CourseLearning::create($data);
   }

   public function updateLearning(array $data, string $id)
   {
      return CourseLearning::find($id)->update($data);
   }

   public function deleteLearning(string $id): bool
   {
      return CourseLearning::find($id)->delete();
   }
}
