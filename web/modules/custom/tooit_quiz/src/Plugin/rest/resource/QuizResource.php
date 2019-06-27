<?php

namespace Drupal\tooit_quiz\Plugin\rest\resource;

use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * Provides an Quiz resource.
 *
 * @RestResource(
 *   id = "quiz_resource",
 *   label = @Translation("Quiz Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/quiz",
 *   }
 * )
 */
class QuizResource extends ResourceBase {

 /**
  * Returns complete response for quiz.
  *
  * @param int $quiz_id
  *   Quiz ID.
  *
  * @return array
  *   Completed array for JSON.
  */
  public function get(Request $request) {
    $data = [];
    if ($nid = $request->query->get('quiz')) {
      $quiz = \Drupal\node\Entity\Node::load($nid);
      $data['id'] = $quiz->id();
      $data['title'] = $quiz->getTitle();
      $data['description'] = !empty($quiz->body->value) ? $quiz->body->value : '';

      if ($paragraphs = $quiz->field_questions_quiz->getValue()) {
        foreach ($paragraphs as $key => $value) {
          $target_id = $value['target_id'];
          if ($paragraph = Paragraph::load($target_id)) {
            $data['questions'][$key]['text'] = $paragraph->field_title_question->value;
            $answers = $paragraph->field_answers_quiz->getValue();
            foreach ($answers as $id => $item) {
              $node = \Drupal\node\Entity\Node::load($item['target_id']);
              $data['questions'][$key]['answers'][$id]['title'] = $node->getTitle();
              $data['questions'][$key]['answers'][$id]['isCorrect'] = (boolean) $node->field_is_a_correct_answers->value;
            }
          }
        }
      }
    }

    $response = new ResourceResponse($data);
    $response->addCacheableDependency($data);

    return $response;
  }

}
