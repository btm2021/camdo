<template>
  <div>
    <img
      ref="image"
      src="/a-705.webp"
      alt="Sample Image"
      width="640"
      height="480"
    />
    <canvas ref="canvas" width="640" height="480"></canvas>
    <button @click="testOpenCV">Test OpenCV</button>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    this.loadOpenCV();
  },
  methods: {
    testOpenCV() {
      const imgElement = this.$refs.image;
      const canvas = this.$refs.canvas;
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      const gray = new cv.Mat();

      // Phát hiện cạnh
      let edges = new cv.Mat();
      cv.Canny(gray, edges, 50, 100, 3, false);

      // Tìm kiếm contours
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Lọc và vẽ contours
      let contourMask = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        // Tùy chỉnh điều kiện để lọc contours phù hợp
        if (cv.contourArea(cnt, false) > 1000) {
          let color = new cv.Scalar(255, 255, 255);
          cv.drawContours(
            contourMask,
            contours,
            i,
            color,
            1,
            cv.LINE_8,
            hierarchy,
            100
          );
        }
        cnt.delete();
      }

      // Áp dụng mask và cắt ảnh
      let result = new cv.Mat();
      src.copyTo(result, contourMask);

      // Hiển thị kết quả
      cv.imshow(canvas, result);
      // Clean up
      src.delete();
      dst.delete();
      gray.delete();

      //   let src = cv.imread('imageId'); // Thay 'imageId' bằng id của thẻ <img> chứa hình ảnh
    },
    loadOpenCV() {
      // Check if OpenCV is already loaded
      if (window.cv && window.cv.imread) {
        this.onCvReady();
      } else {
        // Create script element and set attributes
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/opencv-browser@1.0.0/opencv.min.js";
        script.async = true;
        script.defer = true;

        // Define onload callback
        script.onload = () => {
          cv["onRuntimeInitialized"] = () => {
            this.onCvReady();
          };
        };

        // Handle loading errors
        script.onerror = () => {
          throw new Error("Failed to load the OpenCV.js library");
        };

        // Append the script to the document's body
        document.body.appendChild(script);
      }
    },
    onCvReady() {
      // OpenCV is ready to go
      console.log("OpenCV.js is ready!");
      // More initialization code
      this.testOpenCV();
    },
  },
};
</script>
  