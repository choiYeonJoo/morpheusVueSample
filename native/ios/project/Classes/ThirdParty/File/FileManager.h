//
//  FileManager.h
//
//  Created by 김다솜 on 2022/08/09.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FileManager : NSFileManager <UIDocumentInteractionControllerDelegate>

+ (FileManager *)getInstance;

- (NSString *)getDirPath:(NSString *)dirName;
- (BOOL)makeDir:(NSString *)dirPath;
- (BOOL)deleteDir:(NSString *)dirPath;
- (BOOL)isDir:(NSString *)dirPath;
- (NSArray *)fileList:(NSString *)dirPath;
- (NSDictionary *)fileInfo:(NSString *)dirPath;
- (BOOL)saveImageFile:(NSString *)dirPath :(NSString *)imageName :(NSData *)imageData;
- (void)saveTextFile:(NSString *)dirPath :(NSString *)fileName :(NSString *)data;
- (BOOL)saveDataFile:(NSString *)dirPath :(NSString *)fileName :(NSData *)data;
- (void)open:(NSString *)dirPath :(NSString *)fileName;

@end

NS_ASSUME_NONNULL_END
