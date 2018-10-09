package me.antonioantonino.assignment3

import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.URLUtil
import android.widget.*
import com.beust.klaxon.Klaxon
import com.squareup.picasso.Picasso
import me.antonioantonino.assignment3.Models.Photo
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.net.URL
import java.text.SimpleDateFormat

class PhotoGridAdapter(private val mContext: Context): BaseAdapter() {

    private val activity: MainActivity = mContext as MainActivity

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View? {

        val photoToShow = this.activity.photos?.get(position) ?: return null

        val viewToShow = convertView ?: LayoutInflater.from(mContext).inflate(R.layout.photo_with_description_grid_cell, null)

        val photoImageView = viewToShow.findViewById<ImageView>(R.id.photoImageView)
        photoImageView.layoutParams.height = 150
        photoImageView.layoutParams.width = photoImageView.layoutParams.height

        val photoAuthorTextView = viewToShow.findViewById<TextView>(R.id.photoAuthorTextField)
        photoAuthorTextView.layoutParams.width = photoImageView.layoutParams.width

        Picasso.get().load(photoToShow.photo).into(photoImageView)
        photoAuthorTextView.text = photoToShow.author

        return viewToShow
    }

    override fun getItem(position: Int): Any? {
        return null
    }

    override fun getItemId(position: Int): Long {
        return 0L
    }

    override fun getCount(): Int {
        return this.activity.photos?.count() ?: 0
    }


}

class MainActivity : AppCompatActivity() {

    private lateinit var urlTextField: EditText
    private lateinit var photoGrid: GridView

    var photos: Array<Photo>? = null
        private set(photos) {
            if (photos != null) {
                field = photos
                this.photoGrid.invalidateViews()
            }
        }
    private var sortLogic: OrderLogic? = null
        set(newLogic) {
            if (newLogic != null && newLogic != field) {
                field = newLogic
                val inputURL = this.urlTextField.text.toString()

                if (URLUtil.isValidUrl(inputURL)) {
                    this.loadPhotos(URL(inputURL)) { photos ->
                        this.photos = photos.sortedWith(Comparator(newLogic.compare)).toTypedArray()
                    }
                }
            }
        }

    private enum class OrderLogic {

        Ascend {
            override val compare: (Photo, Photo) -> Int
                get() = { p1, p2 -> p1.author.compareTo(p2.author) }
        },

        Descend {
            override val compare: (Photo, Photo) -> Int
                get() = { p1, p2 -> -p1.author.compareTo(p2.author) }
        },

        Recent {
            override val compare: (Photo, Photo) -> Int
                get() = { p1, p2 -> -(SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(p1.date).compareTo(SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(p2.date))) }
        };

        abstract val compare: ((Photo, Photo) -> Int)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        this.urlTextField = this.findViewById(R.id.txtUrl)

        this.photoGrid = this.findViewById(R.id.photoGrid)
        this.photoGrid.adapter = PhotoGridAdapter(this)

        this.findViewById<Button>(R.id.sortAsc).setOnClickListener { this.sortLogic = OrderLogic.Ascend }
        this.findViewById<Button>(R.id.sortDes).setOnClickListener { this.sortLogic = OrderLogic.Descend }
        this.findViewById<Button>(R.id.sortDate).setOnClickListener { this.sortLogic = OrderLogic.Recent }
    }

    private fun loadPhotos(fromURL: URL, completion: (Array<Photo>) -> Unit) {
        doAsync {
            val photos = Klaxon().parseArray<Photo>(fromURL.readText())!!.toTypedArray()
            uiThread {
                completion(photos)
            }
        }
    }
}