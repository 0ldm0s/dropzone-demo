 
import React, { useEffect, useState } from 'react';
 
const MyDropzone = (props) => {
  //用户存储正在上传的文件列表
  const [uploading, setUpload] = useState<any[]>([]);
  const [srcList, setSrcList] = useState<any[]>([]);
  const [uploadFilename, setUploadFilename] = useState('');
  /**
   * 拖动上传组件初始化
   */
  let myDropzone: any = null;
  const dropInit = async () => {
    const Dropzone = (await import('dropzone')).default;

    // 配置项
    myDropzone = new Dropzone('#my-element', {
      url: '/api/admin/upload/video/dropzone.json',
      previewTemplate: document.querySelector('#template').innerHTML,
      chunking: true,
      dictDefaultMessage: '拖动文件或者点击上传影片文件',
      // addRemoveLinks: true,
      forceChunking: true,
      chunkSize: 1000000,
      acceptedFiles: '.mp4',
      uploadMultiple: false,
      maxFiles: 1,
      // previewsContainer: '#preview_s',
      headers: {
        Authorization: `Bearer: ${localStorage.getItem('jwt')}`,
      },
    });

    /**
     * 添加文件后的回调
     */
    myDropzone.on('addedfile', (file: any) => {
      console.log(`File added: `, file);
      setUploadFilename(file.name);

      initUploading(file.upload.uuid);
    });

    myDropzone.on('uploadprogress', (file: any, progress, bytesSent) => {
      console.log('上传中', file);
    });
    /**
     * 上传成功后的回调
     */
    myDropzone.on('success', (file, callback) => {
      console.log('文件上传完毕', callback);
      // saveUploadsrc(callback.data.src);
      const srcArray = [...srcList];
      srcArray.push(callback.data.src);
      setSrcList(srcArray);

      // if (uploading.length === srcList.length) {
      //   mailmanAdd(srcList);
      // }
    });

    // 删除文件
    myDropzone.on('removedfile', (file) => {
      console.log('remove', file);

      const srcArray = srcList;
      const uploadArray = uploading;

      const uuid = file.upload.uuid;
      console.log('srcArray', srcArray);
      const srcIndex = srcArray.findIndex((item) => item.includes(uuid));

      srcArray.splice(srcIndex, 1);
      setSrcList(srcArray);

      const uploadIndex = uploading.findIndex((item) => item.uuid === uuid);
      uploadArray.splice(uploadIndex, 1);
      setUpload(uploadArray);
    });
  };

  /**
   * 数组中没有uuid的时候push进数组, 便于线程监听
   * @param uuid  当前的uuid
   */
  const initUploading = (uuid: number) => {
    const hasUUID = uploading.findIndex((item) => item.uuid === uuid);

    if (hasUUID == -1) {
      const varupload = uploading;

      varupload.push({ uuid, msg: null });

      setUpload(varupload);
    }
  };

  useEffect(() => {
    dropInit();
    return () => {
      if (myDropzone) {
        console.log('destroy', myDropzone);
        myDropzone.destroy();
      }
    };
  }, []);

  return (
 <>
        <form id="my-element" className="dropzone">
     
        </form>

        <div id="template" style={{ display: 'none' }}>
          <div className="dz-preview dz-file-preview">
            <div className="dz-details">
              <div className="dz-filename">
                <span data-dz-name />
              </div>
              <div className="dz-size" data-dz-size />
            </div>

            <div className="previews dz-preview-single">
              <div className="fileicon">
                icon
              </div>

              <img data-dz-thumbnail />
              <span data-dz-remove />
            </div>

            <div className="dz-progress">
              <span className="dz-upload" data-dz-uploadprogress />
            </div>

            <div className="dz-success-mark">
              <span>
                <svg width="54" height="54" viewBox="0 0 54 54" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.2071 29.7929L14.2929 25.7071C14.6834 25.3166 15.3166 25.3166 15.7071 25.7071L21.2929 31.2929C21.6834 31.6834 22.3166 31.6834 22.7071 31.2929L38.2929 15.7071C38.6834 15.3166 39.3166 15.3166 39.7071 15.7071L43.7929 19.7929C44.1834 20.1834 44.1834 20.8166 43.7929 21.2071L22.7071 42.2929C22.3166 42.6834 21.6834 42.6834 21.2929 42.2929L10.2071 31.2071C9.81658 30.8166 9.81658 30.1834 10.2071 29.7929Z" />
                </svg>
              </span>
            </div>
            <div className="dz-error-mark">
              <span>
                <svg width="54" height="54" viewBox="0 0 54 54" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.2929 20.2929L19.2071 13.2071C18.8166 12.8166 18.1834 12.8166 17.7929 13.2071L13.2071 17.7929C12.8166 18.1834 12.8166 18.8166 13.2071 19.2071L20.2929 26.2929C20.6834 26.6834 20.6834 27.3166 20.2929 27.7071L13.2071 34.7929C12.8166 35.1834 12.8166 35.8166 13.2071 36.2071L17.7929 40.7929C18.1834 41.1834 18.8166 41.1834 19.2071 40.7929L26.2929 33.7071C26.6834 33.3166 27.3166 33.3166 27.7071 33.7071L34.7929 40.7929C35.1834 41.1834 35.8166 41.1834 36.2071 40.7929L40.7929 36.2071C41.1834 35.8166 41.1834 35.1834 40.7929 34.7929L33.7071 27.7071C33.3166 27.3166 33.3166 26.6834 33.7071 26.2929L40.7929 19.2071C41.1834 18.8166 41.1834 18.1834 40.7929 17.7929L36.2071 13.2071C35.8166 12.8166 35.1834 12.8166 34.7929 13.2071L27.7071 20.2929C27.3166 20.6834 26.6834 20.6834 26.2929 20.2929Z" />
                </svg>
              </span>
            </div>
            <div className="del_btn" data-dz-remove>
              <a>
                delete
              </a>
            </div>
            <div className="dz-error-message">
              <span data-dz-errormessage />
            </div>
          </div>
        </div>
 </>
    
   
  );
};

export default MyDropzone;
