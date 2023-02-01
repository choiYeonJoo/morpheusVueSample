//
//  FileManager.m
//
//  Created by 김다솜 on 2022/08/09.
//

#import "FileManager.h"

@interface FileManager()

@property (nonatomic, strong) UIDocumentInteractionController *documentInteractionController;

@end

@implementation FileManager

static FileManager *fileManager = nil;

static NSFileManager *fm = nil;
NSString *const DOWNLOAD_PATH = @".swMobile";         // 다운로드 상위 경로

+ (FileManager *)getInstance {
    @synchronized (self) {
        if(fileManager == nil) {
            fileManager = [[FileManager alloc] init];
            [fileManager initSetting];
        }
    }
    return fileManager;
}
    
- (void)initSetting {
    fm = [NSFileManager defaultManager];
}

/* 폴더명 */
- (NSString *)getDirPath:(NSString *)dirName {
    NSString *docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    return [docDir stringByAppendingString:[NSString stringWithFormat:@"%@", dirName]];
}

/* 폴더 및 파일 생성 */
- (BOOL)makeDir:(NSString *)dirPath {
    NSLog(@"dirPath = %@", dirPath);
    
    NSError *error;
    if(![fm fileExistsAtPath:dirPath]) {
        if([fm createDirectoryAtPath:dirPath withIntermediateDirectories:NO attributes:nil error:&error]) {
            return YES;
        } else {
            return NO;
        }
    }
    return YES;
}

/* 폴더 및 파일 삭제 */
- (BOOL)deleteDir:(NSString *)dirPath {
    return [fm removeItemAtPath:dirPath error:nil];
}

/* 폴더 및 파일 유무 */
- (BOOL)isDir:(NSString *)dirPath{
    return [fm fileExistsAtPath:dirPath];
}

/* 폴더 내 파일 목록 */
- (NSArray *)fileList:(NSString *)dirPath {
    NSSortDescriptor *desc = [[NSSortDescriptor alloc] initWithKey:@"self" ascending:YES];
    NSArray *arrContents = [[fm contentsOfDirectoryAtPath:dirPath error:nil] sortedArrayUsingDescriptors:[NSArray arrayWithObject: desc]];
    return arrContents;
}

/* 파일 정보 */
- (NSDictionary *)fileInfo:(NSString *)dirPath {
    NSDictionary *info = [fm attributesOfItemAtPath:dirPath error:nil];
    return info;
}

/* 이미지 파일 저장 */
- (BOOL)saveImageFile:(NSString *)dirPath :(NSString *)imageName :(NSData *)imageData {
    [self makeDir:dirPath];
    
    NSString *filePath = [dirPath stringByAppendingFormat:@"%@", imageName];
    if([fm createFileAtPath:filePath contents:imageData attributes:nil]){
        return YES;
    } else {
        return NO;
    }
}

/* 텍스트 파일 저장 */
- (void)saveTextFile:(NSString *)dirPath :(NSString *)fileName :(NSString *)data {
    [self makeDir:dirPath];
    
    NSString *filePath = [dirPath stringByAppendingFormat:@"%@", fileName];
    if([fm fileExistsAtPath:filePath]) {
        NSFileHandle *handle = [NSFileHandle fileHandleForWritingAtPath:filePath];
        [handle seekToEndOfFile];
        [handle writeData:[data dataUsingEncoding:NSUTF8StringEncoding]];
        [handle closeFile];
    } else {
        [fm createFileAtPath:filePath contents:[data dataUsingEncoding:NSUTF8StringEncoding] attributes:nil];
    }
}

/* NSData 파일 저장 */
- (BOOL)saveDataFile:(NSString *)dirPath :(NSString *)fileName :(NSData *)data {
    [self makeDir:dirPath];
    
    NSString *file = [dirPath stringByAppendingFormat:@"%@", fileName];
    BOOL flag= [data writeToFile:file options:NSDataWritingFileProtectionComplete error:nil];
    return flag;
}

/* 파일 열기 */
- (void)open:(NSString *)dirPath :(NSString *)fileName {
    // 이미지일 경우 확장자 대문자로 변경
    NSString *extension = [fileName pathExtension];
    if([extension isEqualToString:@"png"] || [extension isEqualToString:@"jpg"]) {
        fileName = [NSString stringWithFormat:@"%@.%@",[fileName stringByDeletingPathExtension], [extension uppercaseString]];
    }
    
    NSString *fileUrl = [dirPath stringByAppendingFormat:@"%@", fileName];
    NSURL *url = [NSURL fileURLWithPath:fileUrl];
    self.documentInteractionController = [UIDocumentInteractionController interactionControllerWithURL: url];
    self.documentInteractionController.delegate = self;
    [self.documentInteractionController presentPreviewAnimated:NO];
}

#pragma mark - UIDocumentInteractionController
- (UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller {
    PPNavigationController *navigationController = [PPNavigationController ppNavigationController];
    return navigationController;
}

@end
