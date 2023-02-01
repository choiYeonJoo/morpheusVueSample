//
//  ExtendWNInterface.m
//

#import "ExtendWNInterface.h"

@interface ExtendWNInterface ()

@property (nonatomic, assign) PPWebViewController *viewctrl;

@end

@implementation ExtendWNInterface

- (id)init {
    self = [super init];
    if (self) {
        
    }
    return self;
}

- (BOOL)checkValidParameters:(NSDictionary *)parameters fromValidClasses:(NSDictionary *)validClasses errorMessage:(NSString **)errorMessage {
    
    for ( NSString *key in validClasses ) {
        Class validClass = [validClasses objectForKey:key];
        id parameter = [parameters objectForKey:key];
        
        if ( parameter == nil ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is null", key];
            return NO;
        }
        
        if ( ![parameter isKindOfClass:validClass] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid type", key];
            return NO;
        }
        
        if ( [validClass isEqual:[NSString class]] && [[parameter stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] isEqualToString:@""]) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
        else if ( [validClass isEqual:[NSDictionary class]] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
        else if ( [validClass isKindOfClass:[NSArray class]] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
    }
    
    return YES;
}

- (BOOL)isAlive {
    if (![[PPNavigationController ppNavigationController] existViewController:_viewController]) {
        PPDebug(@"Already released view controller!!");
        return NO;
    }
    
    return YES;
}

// Callback 구조를 설명하기 위한 Sample Interface
- (NSString *)wnSampleCallback:(NSString *)jsonString {
    NSDictionary *options = [jsonString objectFromJsonString];
    
    if (!options) {
        return [@{@"status":@"FAIL", @"error":@"invalid params"} jsonString];
    }

    NSString *invalidMessage = nil;
    NSDictionary *validClasses = @{
        @"callback": [NSString class]
    };
    
    if ( ! [self checkValidParameters:options fromValidClasses:validClasses errorMessage:&invalidMessage] ) {
        return [@{@"status":@"FAIL", @"error":invalidMessage} jsonString];
    }
    
    NSString *callback = [options objectForKey:@"callback"];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.35 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        NSDictionary *resultInfo = @{
            @"status": @"SUCCESS"
        };
        
        [self.viewController callCbfunction:callback withObjects:resultInfo, nil];
    });
    
    return [@{ @"status": @"PROCESSING" } jsonString];
}


//url 주소로 파일 다운로드 할 때
- (void)exWNFileDownloadAndOpen:(NSString *)stringURL :(NSString *)fileNm :(NSString *)isHwp{
    NSDateFormatter *fm = [[NSDateFormatter alloc] init];
    [fm setDateFormat:@"yyyyMMddHHmm"];
    NSString *currentDateTime = [fm stringFromDate:[NSDate date]];
    
    FileManager *fileManager = [FileManager getInstance];
    NSString *dwldsPath = [fileManager getDirPath:@""];
    NSString *dwldsName = [NSString stringWithFormat:@"/%@_%@", currentDateTime, fileNm];
    @try {
        NSURL  *url = [NSURL URLWithString:stringURL];
        NSData *urlData = [NSData dataWithContentsOfURL:url];
        [fileManager saveDataFile:dwldsPath :dwldsName :urlData];
    } @catch (NSException *exception) {
        NSLog(@"파일 다운로드 실패!");
        [[DialogManager getInstance] showAlertDialog:@"알림" message:@"파일 다운로드에 실패하였습니다." btnText:@"확인" listener:^(NSInteger idx){
        }];
        return;
    }
    NSString *appName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"];
    NSString *alertMsg = [NSString stringWithFormat:@"파일 다운로드가 완료되었습니다.\n'파일 > 나의 iPhone > %@' 폴더에 저장되었습니다.", appName];
    if([isHwp isEqualToString:@"Y"]) {
        [[DialogManager getInstance] showAlertDialog:@"알림" message:alertMsg btnText:@"확인" listener:^(NSInteger idx){}];
    }else{
        [[DialogManager getInstance] showAlertDialog:@"알림" message:alertMsg leftBtnText:@"확인" rightBtnText:@"열기" listener:^(NSInteger idx){
            if(idx == 1) {
                [fileManager open:dwldsPath :dwldsName];
            }
        }];
    }
}

//2) Base64 데이터로 파일을 저장할 경우

- (void)exWNBase64FileDownloadAndOpen:(NSString *)base64Data :(NSString *)fileNm :(NSString *)isHwp {
    NSDateFormatter *fm = [[NSDateFormatter alloc] init];
    [fm setDateFormat:@"yyyyMMdd HH.mm"];
    NSString *currentDateTime = [fm stringFromDate:[NSDate date]];
    
    FileManager *fileManager = [FileManager getInstance];
    NSString *dwldsPath = [fileManager getDirPath:@""];
    NSString *dwldsName = [NSString stringWithFormat:@"/%@_%@", currentDateTime, fileNm];
    @try {
        base64Data = [base64Data stringByReplacingOccurrencesOfString:@"data:application/octet-stream;base64,"
                                              withString:@""
                                                 options:0
                                                   range:[base64Data rangeOfString:@"data:application/octet-stream;base64,"]];
        NSData *pdfAsDecode = [[NSData alloc]initWithBase64EncodedString:base64Data options:0];
        [fileManager saveDataFile:dwldsPath :dwldsName :pdfAsDecode];
    } @catch (NSException *exception) {
        NSLog(@"파일 다운로드 실패!");
        [[DialogManager getInstance] showAlertDialog:@"알림" message:@"파일 다운로드에 실패하였습니다." btnText:@"확인" listener:^(NSInteger idx){
        }];
        return;
    }
    NSString *appName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"];
    NSString *alertMsg = [NSString stringWithFormat:@"파일 다운로드가 완료되었습니다.\n'파일 > 나의 iPhone > %@' 폴더에 저장되었습니다.", appName];
    if([isHwp isEqualToString:@"Y"]) {
        [[DialogManager getInstance] showAlertDialog:@"알림" message:alertMsg btnText:@"확인" listener:^(NSInteger idx){}];
    }else{
        [[DialogManager getInstance] showAlertDialog:@"알림" message:alertMsg leftBtnText:@"확인" rightBtnText:@"열기" listener:^(NSInteger idx){
            if(idx == 1) {
                [fileManager open:dwldsPath :dwldsName];
            }
        }];
    }
}



@end
