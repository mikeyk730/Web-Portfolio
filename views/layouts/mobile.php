<?php
use yii\helpers\Html;
use app\assets\MobileAsset;

/* @var $this \yii\web\View */
/* @var $content string */

MobileAsset::register($this);
?>

<?php $this->beginPage() ?>
<!doctype html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= $this->title ? Html::encode($this->title)." - " : "" ?><?= Yii::$app->name; ?></title>
    <?php $this->head() ?>
</head>

<?php $this->beginBody() ?>
            <?= $content ?>

<?php $this->endBody() ?>

</html>
<?php $this->endPage() ?>
