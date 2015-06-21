<?php
namespace app\commands;

use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        $auth = Yii::$app->authManager;

        // add "createContent" permission
        $createContent = $auth->createPermission('createContent');
        $createContent->description = 'Create contents';
        $auth->add($createContent);

        // add "author" role and give this role the "createContent" permission
        $author = $auth->createRole('author');
        $auth->add($author);
        $auth->addChild($author, $createContent);

        // add the author rule
        $rule = new \app\rbac\AuthorRule;
        $auth->add($rule);

        // add the "modifyOwnContent" permission and associate the rule with it.
        $modifyOwnContent = $auth->createPermission('modifyOwnContent');
        $modifyOwnContent->description = 'Modify own content';
        $modifyOwnContent->ruleName = $rule->name;
        $auth->add($modifyOwnContent);

        // "modifyOwnContent" will be used from "modifyContent"
        $modifyContent = $auth->createPermission('modifyContent');
        $modifyContent->description = 'Modify contents';
        $auth->add($modifyContent);
        $auth->addChild($modifyOwnContent, $modifyContent);
        
        // allow "author" to modify their own contents
        $auth->addChild($author, $modifyOwnContent);

        $auth->assign($author, 100);
        $auth->assign($author, 101);
    }
}
