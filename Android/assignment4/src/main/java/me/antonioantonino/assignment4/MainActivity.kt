package me.antonioantonino.assignment4

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import com.google.firebase.ml.vision.FirebaseVision
import com.google.firebase.ml.vision.barcode.FirebaseVisionBarcode
import com.google.firebase.ml.vision.barcode.FirebaseVisionBarcodeDetectorOptions
import com.google.firebase.ml.vision.common.FirebaseVisionImage
import com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions
import kotlin.math.max

class MainActivity : AppCompatActivity() {

    companion object {
        private const val imagePickerActivityID = 1
    }

    private var pic: Bitmap? = null
        set(value) {
            value?.also { newPic ->
                this.arePeopleSmilingTextView.text = "no"
                this.havePeopleOpenEyesTextView.text = "no"
                this.peopleNumberTextView.text = "0"
                this.barcodePresenceTextView.text = "no"

                val visionImage = FirebaseVisionImage.fromBitmap(newPic)

                val faceDetector = FirebaseVision.getInstance().getVisionFaceDetector(this.faceDetectorOptions)

                faceDetector.detectInImage(visionImage).addOnSuccessListener { faces ->

                    faceDetector.close()

                    val totalFaces = faces.size
                    this.peopleNumberTextView.text = totalFaces.toString()

                    if (totalFaces > 0) {
                        Log.d("MCC", "There are faces.")
                        val smileConfidence = faces.fold(0f) { acc, firebaseVisionFace ->
                            acc + firebaseVisionFace.smilingProbability
                        } / totalFaces
                        val arePeopleSmiling = smileConfidence >= 0.5

                        val eyesOpenedConfidenceSum = faces.fold(Pair(0f, 0f)) { acc, firebaseVisionFace ->
                            Pair(acc.first + firebaseVisionFace.leftEyeOpenProbability, acc.second + firebaseVisionFace.rightEyeOpenProbability)
                        }
                        val eyesOpenedConfidenceAverage = Pair(eyesOpenedConfidenceSum.first / totalFaces, eyesOpenedConfidenceSum.second / totalFaces)
                        val havePeopleBothEyesOpen = eyesOpenedConfidenceAverage.first >= 0.5 && eyesOpenedConfidenceAverage.second >= 0.5

                        this.arePeopleSmilingTextView.text = if (arePeopleSmiling) "yes" else "no"
                        this.havePeopleOpenEyesTextView.text = if (havePeopleBothEyesOpen) "yes" else "no"
                    } else {
                        //Empty faces, try barcode
                        val barcodeDetector = FirebaseVision.getInstance().getVisionBarcodeDetector(this.barcodeDetectorOptions)

                        barcodeDetector.detectInImage(visionImage).addOnSuccessListener { barcodes ->
                            barcodeDetector.close()
                            Log.d("MCC", "Barcodes: $barcodes")
                            this.barcodePresenceTextView.text = if (barcodes.isNotEmpty()) "yes" else "no"
                        }
                    }
                }
            }
        }

    private lateinit var peopleNumberTextView: TextView
    private lateinit var barcodePresenceTextView: TextView
    private lateinit var arePeopleSmilingTextView: TextView
    private lateinit var havePeopleOpenEyesTextView: TextView

    private lateinit var faceDetectorOptions: FirebaseVisionFaceDetectorOptions
    private lateinit var barcodeDetectorOptions: FirebaseVisionBarcodeDetectorOptions

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        this.peopleNumberTextView = this.findViewById(R.id.txtNumPeople)
        this.barcodePresenceTextView = this.findViewById(R.id.txtBarcode)
        this.arePeopleSmilingTextView = this.findViewById(R.id.txtSmile)
        this.havePeopleOpenEyesTextView = this.findViewById(R.id.txtEyes)

        this.findViewById<Button>(R.id.btnPickPhoto).setOnClickListener {
            val imageIntent = Intent()
            imageIntent.type = "image/*"
            imageIntent.action = Intent.ACTION_GET_CONTENT
            this.startActivityForResult(imageIntent, MainActivity.imagePickerActivityID)
        }

        this.faceDetectorOptions = FirebaseVisionFaceDetectorOptions.Builder()
                .setModeType(FirebaseVisionFaceDetectorOptions.ACCURATE_MODE)
                .setLandmarkType(FirebaseVisionFaceDetectorOptions.NO_LANDMARKS)
                .setClassificationType(FirebaseVisionFaceDetectorOptions.ALL_CLASSIFICATIONS)
                .setMinFaceSize(0.15f)
                .setTrackingEnabled(false)
                .build()

        this.barcodeDetectorOptions = FirebaseVisionBarcodeDetectorOptions.Builder()
                .setBarcodeFormats(FirebaseVisionBarcode.FORMAT_ALL_FORMATS)
                .build()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode != MainActivity.imagePickerActivityID) return
        if (resultCode != Activity.RESULT_OK) return

        val picURI = data?.data ?: return

        Log.d("MCC", "URI: ${picURI.path}")

        val options = BitmapFactory.Options().apply { this.inJustDecodeBounds = true }

        var picInputStream = this.contentResolver.openInputStream(picURI)

        Log.d("MCC", "InputStream: ${picInputStream}")

        BitmapFactory.decodeStream(picInputStream, null, options)
        picInputStream?.close()

        var scalingFactor = 1
        val maxMeasure = max(options.outHeight, options.outWidth)

        while (maxMeasure / scalingFactor >= 4096) {
            scalingFactor *= 2
        }

        Log.d("MCC", "Final scaling factor: $scalingFactor")

        options.apply {
            this.inSampleSize = scalingFactor
            this.inJustDecodeBounds = false
        }

        picInputStream = this.contentResolver.openInputStream(picURI)
        val p = BitmapFactory.decodeStream(picInputStream, null, options)
        picInputStream?.close()

        Log.d("MCC", "Final pic chosen : $p")

        this.pic = p
    }
}