<?php

namespace Drupal\tooit_quiz\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;


/**
 * Provides a block with a simple text.
 *
 * @Block(
 *   id = "tooit_quizblock",
 *   admin_label = @Translation("Quiz block"),
 *   category = @Translation("Quiz block"),
 * )
 */
class TooitQuizBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    if (!empty($config['tooit_quiz_block_qid'])) {
      $qid = $config['tooit_quiz_block_qid'];
    }
    else {
      $qid = 1;
    }

    if (!empty($config['tooit_quiz_block_url'])) {
      $url = $config['tooit_quiz_block_url'];
    }
    else {
      $url = '/api/quiz/';
    }

    return [
      '#theme' => 'tooit_quiz_block_theme',
      '#attached' => [
        'library' => [
          'tooit_quiz/tooit_quiz_style',
        ],
        'drupalSettings' => [
          'tooit_quiz_block' => [
            'quiz_url' => $url,
          ],
        ],
      ],
      '#qid' => $qid,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);

    $config = $this->getConfiguration();



    $form['tooit_quiz_block_qid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Quiz ID'),
      '#default_value' => !empty($config['tooit_quiz_block_qid']) ? $config['tooit_quiz_block_qid'] : '',
    ];

    $form['tooit_quiz_block_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Quiz data url'),
      '#default_value' => !empty($config['tooit_quiz_block_url']) ? $config['tooit_quiz_block_url'] : 'api/quiz',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['tooit_quiz_block_qid'] = $values['tooit_quiz_block_qid'];
    $this->configuration['tooit_quiz_block_url'] = $values['tooit_quiz_block_url'];
  }

  /**
   * {@inheritdoc}
   */
  protected function blockAccess(AccountInterface $account) {
    return AccessResult::allowedIfHasPermission($account, 'access content');
  }

}
