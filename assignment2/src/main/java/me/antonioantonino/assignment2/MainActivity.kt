package me.antonioantonino.assignment2

import android.content.pm.ActivityInfo
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.Switch
import android.widget.TextView

class MainActivity : AppCompatActivity() {

    private lateinit var switch: Switch
    private lateinit var portraitTextView: TextView
    private lateinit var landscapeTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        this.portraitTextView = findViewById(R.id.textPortrait)
        this.landscapeTextView= findViewById(R.id.textLandscape)

        this.switch = findViewById(R.id.scrChange)
        this.switch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) this.switchToLandscape() else this.switchToPortrait()
        }

        this.switchToPortrait()
    }

    private fun switchToLandscape() {
        this.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        this.landscapeTextView.text = "Screen mode is set to landscape"
        this.portraitTextView.text = ""
    }

    private fun switchToPortrait() {
        this.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        this.portraitTextView.text = "Screen mode is set to portrait"
        this.landscapeTextView.text = ""
    }

}
