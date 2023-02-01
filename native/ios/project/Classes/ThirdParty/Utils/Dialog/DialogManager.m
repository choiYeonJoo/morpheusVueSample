//
//  DialogManager.m
//
//  Created by 김다솜 on 2022/08/22.
//

#import "DialogManager.h"

@implementation DialogManager

static DialogManager *dialogManager = nil;

+ (DialogManager *)getInstance {
    @synchronized (self) {
        if(dialogManager == nil) {
            dialogManager = [[DialogManager alloc] init];
        }
    }
    return dialogManager;
}

-(void)showAlertDialog:(NSString *) title message:(NSString *) message btnText:(NSString *) btnText listener:(ButtonClickListener)listener {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title
                                                                             message:message
                                                                      preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:btnText
                                                            style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * _Nonnull action) {
        listener(0);
    }];
    [alertController addAction:confirmAction];
    PPNavigationController *navigationController = [PPNavigationController ppNavigationController];
    PPWebViewController *current = (PPWebViewController *)navigationController.currentViewCtrl;
    [current presentViewController:alertController animated:YES completion:nil];
}

-(void)showAlertDialog:(NSString *) title message:(NSString *) message leftBtnText:(NSString *) leftBtnText rightBtnText:(NSString *) rightBtnText listener:(ButtonClickListener)listener {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title
                                                                             message:message
                                                                      preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:leftBtnText
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction * _Nonnull action) {
        listener(0);
    }];
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:rightBtnText
                                                            style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * _Nonnull action) {
        listener(1);
    }];
    [alertController addAction:cancelAction];
    [alertController addAction:confirmAction];
    PPNavigationController *navigationController = [PPNavigationController ppNavigationController];
    PPWebViewController *current = (PPWebViewController *)navigationController.currentViewCtrl;
    [current presentViewController:alertController animated:YES completion:nil];
}

@end
