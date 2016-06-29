<?php
/**
 * A class that encapsulates functionality needed to stream a file from S3 storage.
 */

class FileStream extends BaseModel
{
    private $s3;

    //
    // Default constructor.  Create an S3 instance.
    //
    public function  __construct() {
        $this->s3 = AWS::get('s3');
    }

    //
    // Retrieve and download file content from S3 storage.
    //
    public function streamFile($key, $bucket)
    {
        // Retrieve file metadata from S3.
        $fileMetadata = null;

        try {
            $fileMetadata = $this->s3->headObject(array(
                'Bucket' => $bucket,
                'Key' => $key
            ));
        } catch (Exception $ex) {
            $fileMetadata = null;
        }

        // Handle "not found" condition.
        if (empty($fileMetadata)) {
            Log::error((string) $ex, array('method' => 'streamFile'));
            header('HTTP/1.1 404 Not Found');
            $this->sendDataNow("");
            return;
        }

        $size   = $fileMetadata['ContentLength'];   // File size
        $length = $size;                            // Default content length
        $start  = 0;                                // Default start byte
        $end    = $size - 1;                        // Default end byte

        header('Content-Type: ' . $fileMetadata['ContentType']);
        header("Content-Length: ".$length);
        $chunkSize = (strcmp($fileMetadata['ContentType'], 'application/pdf') === 0) ? $size : 524288;
        $this->streamInChunks($bucket, $key, $start, $end, $chunkSize);
    }


    // **************************************************************
    //
    // Private helper methods.
    //
    // **************************************************************

    //
    // Read and send the requested range of bytes in .5 MB chunks.
    //
    private function streamInChunks($bucket, $key, $start, $end, $chunkSize)
    {
        $chunkStart = $start;
        while ($chunkStart <= $end) {
            // As long as we are making progress, don't let script timeout.
            set_time_limit(20);

            $bytesToRead = $chunkSize;
            if (($chunkStart + $bytesToRead) > $end) {
                $bytesToRead = $end - $chunkStart + 1;
            }
            $chunkEnd = $chunkStart + $bytesToRead - 1;

            $s3Range = 'bytes=' .$chunkStart .'-' .$chunkEnd;
            $fileContent = $this->s3->getObject(array(
                'Bucket' => $bucket,
                'Key' => $key,
                'Range' => $s3Range
            ));

            $this->sendDataNow($fileContent['Body']);
            $chunkStart += $bytesToRead;
        }
        return;
    }

    //
    // Send data to client immediately.
    //
    private function sendDataNow($data)
    {
        // Echo data, if any.
        if (strlen($data) > 0) {
            echo $data;
        }
        // and flush output buffer.
        if (ob_get_level()) {
            ob_end_flush();
        }
        flush();
    }


}