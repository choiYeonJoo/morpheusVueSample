//
//  DialogManager.h
//
//  Created by 김다솜 on 2022/08/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^ButtonClickListener)(NSInteger idx);

@interface DialogManager : NSObject {
}

+ (DialogManager *)getInstance;
- (void)showAlertDialog:(NSString *) title message:(NSString *) message btnText:(NSString *) btnText listener:(ButtonClickListener)listener;
- (void)showAlertDialog:(NSString *) title message:(NSString *) message leftBtnText:(NSString *) leftBtnText rightBtnText:(NSString *) rightBtnText listener:(ButtonClickListener)listener;

@end

NS_ASSUME_NONNULL_END
