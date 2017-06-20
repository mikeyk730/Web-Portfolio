<?php
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\captcha\Captcha;

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\ContactForm */

$this->title = 'Contact';
$this->params['breadcrumbs'][] = $this->title;
$is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;
$branding = $is_mobile ? '{m.kaminski}' : '{mk}';
?>
<div class="left" id="container">
    <div id="layout">
        <header>
            <div>
                <a class="menu" href="#">Menu</a>
	        <h1>
                    <?= Html::a('<span>'.$branding.'</span>', ['/album/home']); ?>
	        </h1>
            </div>
            <?= $this->render('//album/nav', ['album_id' => 'contact']); ?>
        </header>

<div class="site-contact" id="content">
    <h1>Social Media</h1>
    <div class="social-media-links">
        <p>
        <a href="https://www.instagram.com/one_more_country"><img width="48" src="../main/assets/logo-instagram.png"></a>
        <a href="https://www.500px.com/one_more_country"><img width="48" src="../main/assets/logo-500px.png"></a>
    </p>
    </div>

    <h1>Email</h1>
    <?php if (Yii::$app->session->hasFlash('contactFormSubmitted')): ?>

    <div class="alert alert-success">
        Thank you for contacting me.  I will respond to you as soon as possible.
    </div>

    <?php else: ?>

    <p>
        Feel free to contact me if you are interested in ordering prints or licensing an image.  I welcome any other questions or comments as well!
    </p>

    <div class="row">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'contact-form']); ?>
                <?= $form->field($model, 'name') ?>
                <?= $form->field($model, 'email') ?>
                <!--?= $form->field($model, 'subject') ?-->
                <?= $form->field($model, 'body')->textArea(['rows' => 6]) ?>
                <!--?= $form->field($model, 'verifyCode')->widget(Captcha::className(), [
                    'template' => '<div class="row"><div class="col-lg-3">{image}</div><div class="col-lg-6">{input}</div></div>',
                ]) ?-->
                <div class="form-group">
                    <?= Html::submitButton('Submit', ['class' => 'btn btn-primary', 'name' => 'contact-button']) ?>
                </div>
            <?php ActiveForm::end(); ?>
        </div>
    </div>

    <?php endif; ?>
</div>
        <footer>
            <p class="copyright">&copy; 2015 Mike Kaminski</p>
        </footer>
    </div>
</div>
